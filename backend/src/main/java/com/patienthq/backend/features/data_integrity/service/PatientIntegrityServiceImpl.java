package com.patienthq.backend.features.data_integrity.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.patienthq.backend.features.data_integrity.DataIntegrityMapper;
import com.patienthq.backend.features.data_integrity.dto.DataIntegrityDto;
import com.patienthq.backend.features.data_integrity.dto.IntegrityVerificationDto;
import com.patienthq.backend.features.data_integrity.model.DataIntegrity;
import com.patienthq.backend.features.data_integrity.model.IntegrityStatus;
import com.patienthq.backend.features.data_integrity.repository.DataIntegrityRepository;
import com.patienthq.backend.features.patient.model.Patient;
import com.patienthq.backend.features.patient.repository.PatientRepository;
import com.patienthq.backend.shared.exceptions.AppException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class PatientIntegrityServiceImpl implements PatientIntegrityService {

    private final DataIntegrityRepository dataIntegrityRepository;
    private final PatientRepository patientRepository;
    private final JdbcTemplate jdbcTemplate;
    private final DataIntegrityMapper dataIntegrityMapper;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional(readOnly = true)
    public DataIntegrityDto getIntegrity(UUID patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Patient not found with id: " + patientId));

        DataIntegrity dataIntegrity = dataIntegrityRepository.findByPatientId(patientId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Data integrity record not found for patient: " + patientId));

        return dataIntegrityMapper.toDto(dataIntegrity);
    }

    @Override
    @Transactional
    public IntegrityVerificationDto verifyIntegrity(UUID patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Patient not found with id: " + patientId));

        DataIntegrity dataIntegrity = dataIntegrityRepository.findByPatientId(patientId)
                .orElse(null);

        if (dataIntegrity == null) {
            log.warn("No integrity record found for patient {}. Auto-creating.", patientId);
            return IntegrityVerificationDto.builder()
                    .patientId(patientId)
                    .patientName(patient.getFullName())
                    .status(IntegrityStatus.PENDING)
                    .currentHash(null)
                    .storedHash(null)
                    .isValid(false)
                    .verifiedAt(LocalDateTime.now())
                    .build();
        }

        String currentHash = computePatientDataHash(patientId);
        String storedHash = dataIntegrity.getHashValue();
        boolean isValid = currentHash.equals(storedHash);

        IntegrityStatus newStatus = isValid ? IntegrityStatus.VALID : IntegrityStatus.TAMPERED;
        dataIntegrity.setStatus(newStatus);
        dataIntegrity.setLastChecked(LocalDateTime.now());
        dataIntegrityRepository.save(dataIntegrity);

        log.info("Integrity verification for patient {}: {}", patientId, newStatus);

        return IntegrityVerificationDto.builder()
                .patientId(patientId)
                .patientName(patient.getFullName())
                .status(newStatus)
                .currentHash(currentHash)
                .storedHash(storedHash)
                .isValid(isValid)
                .verifiedAt(LocalDateTime.now())
                .build();
    }

    @Override
    @Transactional
    public DataIntegrityDto recomputeIntegrity(UUID patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Patient not found with id: " + patientId));

        String newHash = computePatientDataHash(patientId);

        DataIntegrity dataIntegrity = dataIntegrityRepository.findByPatientId(patientId)
                .orElse(null);

        if (dataIntegrity == null) {
            dataIntegrity = DataIntegrity.builder()
                    .patient(patient)
                    .hashValue(newHash)
                    .status(IntegrityStatus.VALID)
                    .lastChecked(LocalDateTime.now())
                    .build();
        } else {
            dataIntegrity.setHashValue(newHash);
            dataIntegrity.setStatus(IntegrityStatus.VALID);
            dataIntegrity.setLastChecked(LocalDateTime.now());
        }

        dataIntegrity = dataIntegrityRepository.save(dataIntegrity);
        log.info("Recomputed integrity for patient {}: {}", patientId, newHash);

        return dataIntegrityMapper.toDto(dataIntegrity);
    }

    @Override
    @Transactional
    public void markPending(UUID patientId) {
        if (dataIntegrityRepository.existsByPatientPatientId(patientId)) {
            dataIntegrityRepository.markAsPending(patientId);
            log.debug("Marked integrity as PENDING for patient {}", patientId);
        }
    }

    /**
     * Computes SHA-256 hash of all patient-related data.
     * Uses deterministic JSON aggregation with consistent ordering.
     */
    private String computePatientDataHash(UUID patientId) {
        Map<String, Object> aggregatedData = new LinkedHashMap<>();

        // 1. Patient data
        aggregatedData.put("patient", fetchPatientData(patientId));

        // 2. Medical records (ordered by created_at, record_id)
        aggregatedData.put("medical_records", fetchMedicalRecords(patientId));

        // 3. Vital signs (ordered by recorded_at, vital_id)
        aggregatedData.put("vital_signs", fetchVitalSigns(patientId));

        // 4. Appointments (ordered by created_at, appointment_id)
        aggregatedData.put("appointments", fetchAppointments(patientId));

        return hashData(aggregatedData);
    }

    private Map<String, Object> fetchPatientData(UUID patientId) {
        String sql = """
            SELECT patient_id, full_name, date_of_birth, gender, contact_number,
                   email, address, blood_type, allergies, emergency_contact_name,
                   emergency_contact_number, status, created_at
            FROM patients
            WHERE patient_id = ?
        """;

        return jdbcTemplate.query(sql, rs -> {
            if (rs.next()) {
                Map<String, Object> data = new LinkedHashMap<>();
                data.put("patient_id", rs.getString("patient_id"));
                data.put("full_name", rs.getString("full_name"));
                data.put("date_of_birth", rs.getDate("date_of_birth") != null ? rs.getDate("date_of_birth").toString() : null);
                data.put("gender", rs.getString("gender"));
                data.put("contact_number", rs.getString("contact_number"));
                data.put("email", rs.getString("email"));
                data.put("address", rs.getString("address"));
                data.put("blood_type", rs.getString("blood_type"));
                data.put("allergies", rs.getString("allergies"));
                data.put("emergency_contact_name", rs.getString("emergency_contact_name"));
                data.put("emergency_contact_number", rs.getString("emergency_contact_number"));
                data.put("status", rs.getString("status"));
                data.put("created_at", rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toString() : null);
                return data;
            }
            return new LinkedHashMap<>();
        }, patientId);
    }

    private List<Map<String, Object>> fetchMedicalRecords(UUID patientId) {
        String sql = """
            SELECT record_id, patient_id, doctor_id, diagnosis, treatment,
                   prescription, notes, created_at
            FROM medical_records
            WHERE patient_id = ?
            ORDER BY created_at, record_id
        """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Map<String, Object> record = new LinkedHashMap<>();
            record.put("record_id", rs.getString("record_id"));
            record.put("patient_id", rs.getString("patient_id"));
            record.put("doctor_id", rs.getString("doctor_id"));
            record.put("diagnosis", rs.getString("diagnosis"));
            record.put("treatment", rs.getString("treatment"));
            record.put("prescription", rs.getString("prescription"));
            record.put("notes", rs.getString("notes"));
            record.put("created_at", rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toString() : null);
            return record;
        }, patientId);
    }

    private List<Map<String, Object>> fetchVitalSigns(UUID patientId) {
        String sql = """
            SELECT vital_id, patient_id, recorded_by, temperature, heart_rate,
                   respiratory_rate, oxygen_saturation, blood_pressure, weight,
                   height, notes, recorded_at
            FROM vital_signs
            WHERE patient_id = ?
            ORDER BY recorded_at, vital_id
        """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Map<String, Object> vital = new LinkedHashMap<>();
            vital.put("vital_id", rs.getString("vital_id"));
            vital.put("patient_id", rs.getString("patient_id"));
            vital.put("recorded_by", rs.getString("recorded_by"));
            vital.put("temperature", rs.getBigDecimal("temperature") != null ? rs.getBigDecimal("temperature").toString() : null);
            vital.put("heart_rate", rs.getObject("heart_rate"));
            vital.put("respiratory_rate", rs.getObject("respiratory_rate"));
            vital.put("oxygen_saturation", rs.getBigDecimal("oxygen_saturation") != null ? rs.getBigDecimal("oxygen_saturation").toString() : null);
            vital.put("blood_pressure", rs.getString("blood_pressure"));
            vital.put("weight", rs.getBigDecimal("weight") != null ? rs.getBigDecimal("weight").toString() : null);
            vital.put("height", rs.getBigDecimal("height") != null ? rs.getBigDecimal("height").toString() : null);
            vital.put("notes", rs.getString("notes"));
            vital.put("recorded_at", rs.getTimestamp("recorded_at") != null ? rs.getTimestamp("recorded_at").toString() : null);
            return vital;
        }, patientId);
    }

    private List<Map<String, Object>> fetchAppointments(UUID patientId) {
        String sql = """
            SELECT appointment_id, patient_id, doctor_id, appointment_date,
                   reason, status, notes, created_at
            FROM appointments
            WHERE patient_id = ?
            ORDER BY created_at, appointment_id
        """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Map<String, Object> appointment = new LinkedHashMap<>();
            appointment.put("appointment_id", rs.getString("appointment_id"));
            appointment.put("patient_id", rs.getString("patient_id"));
            appointment.put("doctor_id", rs.getString("doctor_id"));
            appointment.put("appointment_date", rs.getTimestamp("appointment_date") != null ? rs.getTimestamp("appointment_date").toString() : null);
            appointment.put("reason", rs.getString("reason"));
            appointment.put("status", rs.getString("status"));
            appointment.put("notes", rs.getString("notes"));
            appointment.put("created_at", rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toString() : null);
            return appointment;
        }, patientId);
    }

    /**
     * Converts data to deterministic JSON and computes SHA-256 hash.
     */
    private String hashData(Map<String, Object> data) {
        try {
            String json = objectMapper.writeValueAsString(data);
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(json.getBytes(StandardCharsets.UTF_8));
            return bytesToHex(hashBytes);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize data to JSON", e);
            throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to compute integrity hash");
        } catch (NoSuchAlgorithmException e) {
            log.error("SHA-256 algorithm not available", e);
            throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "Hashing algorithm unavailable");
        }
    }

    /**
     * Converts byte array to hexadecimal string.
     */
    private String bytesToHex(byte[] bytes) {
        StringBuilder hexString = new StringBuilder();
        for (byte b : bytes) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }
}
