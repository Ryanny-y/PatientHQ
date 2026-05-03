package com.patienthq.backend.features.vital_signs.service;

import com.patienthq.backend.features.data_integrity.service.PatientIntegrityService;
import com.patienthq.backend.features.nurse.model.Nurse;
import com.patienthq.backend.features.nurse.service.NurseService;
import com.patienthq.backend.features.patient.model.Patient;
import com.patienthq.backend.features.patient.service.PatientService;
import com.patienthq.backend.features.vital_signs.dto.request.CreateVitalSignsRequest;
import com.patienthq.backend.features.vital_signs.model.VitalSign;
import com.patienthq.backend.features.vital_signs.repository.VitalSignsRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VitalSignsServiceImpl implements VitalSignsService {

    private final VitalSignsRepository vitalSignsRepository;
    private final PatientService patientService;
    private final NurseService nurseService;
    private final PatientIntegrityService patientIntegrityService;

    @Override
    @Transactional(readOnly = true)
    public List<VitalSign> getAllVitalSigns() {
        return vitalSignsRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public VitalSign getVitalSignsById(UUID id) {
        return vitalSignsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vital signs not found with ID: " + id));
    }

    @Override
    @Transactional
    public VitalSign createVitalSigns(CreateVitalSignsRequest request) {
        Patient patient = patientService.getPatientById(request.getPatientId());
        Nurse nurse = nurseService.getNurseById(request.getRecordedBy());

        VitalSign vitalSign = VitalSign.builder()
                .patient(patient)
                .recordedBy(nurse)
                .temperature(request.getTemperature())
                .heartRate(request.getHeartRate())
                .respiratoryRate(request.getRespiratoryRate())
                .oxygenSaturation(request.getOxygenSaturation())
                .bloodPressure(request.getBloodPressure())
                .notes(request.getNotes())
                .build();

        VitalSign saved = vitalSignsRepository.save(vitalSign);
        patientIntegrityService.markPending(request.getPatientId());
        return saved;
    }
}