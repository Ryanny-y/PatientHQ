package com.patienthq.backend.features.patient.service;

import com.patienthq.backend.features.patient.dto.request.CreatePatientRequest;
import com.patienthq.backend.features.patient.dto.request.UpdatePatientRequest;
import com.patienthq.backend.features.patient.model.Patient;
import com.patienthq.backend.features.patient.model.PatientStatus;
import com.patienthq.backend.features.patient.repository.PatientRepository;
import com.patienthq.backend.shared.exceptions.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;

    @Override
    @Transactional
    public Patient createPatient(CreatePatientRequest request) {

        Patient patient = Patient.builder()
                .fullName(request.getFullName())
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .contactNumber(request.getContactNumber())
                .email(request.getEmail())
                .address(request.getAddress())
                .bloodType(request.getBloodType())
                .allergies(request.getAllergies())
                .emergencyContactName(request.getEmergencyContactName())
                .emergencyContactNumber(request.getEmergencyContactNumber())
                .status(request.getStatus() != null ? request.getStatus() : PatientStatus.ACTIVE)
                .build();

        return patientRepository.save(patient);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Patient getPatientById(UUID id) {
        return findPatientById(id);
    }

    @Override
    @Transactional
    public Patient updatePatient(UUID id, UpdatePatientRequest request) {

        Patient patient = findPatientById(id);

        if (request.getFullName() != null) {
            patient.setFullName(request.getFullName());
        }

        if (request.getDateOfBirth() != null) {
            patient.setDateOfBirth(request.getDateOfBirth());
        }

        if (request.getGender() != null) {
            patient.setGender(request.getGender());
        }

        if (request.getContactNumber() != null) {
            patient.setContactNumber(request.getContactNumber());
        }

        if (request.getEmail() != null) {
            patient.setEmail(request.getEmail());
        }

        if (request.getAddress() != null) {
            patient.setAddress(request.getAddress());
        }

        if (request.getBloodType() != null) {
            patient.setBloodType(request.getBloodType());
        }

        if (request.getAllergies() != null) {
            patient.setAllergies(request.getAllergies());
        }

        if (request.getEmergencyContactName() != null) {
            patient.setEmergencyContactName(request.getEmergencyContactName());
        }

        if (request.getEmergencyContactNumber() != null) {
            patient.setEmergencyContactNumber(request.getEmergencyContactNumber());
        }

        if (request.getStatus() != null) {
            patient.setStatus(request.getStatus());
        }

        return patientRepository.save(patient);
    }

    @Override
    @Transactional
    public void deletePatient(UUID id) {
        Patient patient = findPatientById(id);
        patientRepository.delete(patient);
    }

    private Patient findPatientById(UUID id) {
        return patientRepository.findById(id)
                .orElseThrow(() ->
                        new AppException(HttpStatus.NOT_FOUND,
                                "Patient not found with id: " + id));
    }
}