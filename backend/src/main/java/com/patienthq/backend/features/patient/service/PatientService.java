package com.patienthq.backend.features.patient.service;

import com.patienthq.backend.features.patient.dto.request.CreatePatientRequest;
import com.patienthq.backend.features.patient.dto.request.UpdatePatientRequest;
import com.patienthq.backend.features.patient.model.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface PatientService {

    Patient createPatient(CreatePatientRequest request);

    Page<Patient> getAllPatients(Pageable pageable);

    Patient getPatientById(UUID id);

    Patient updatePatient(UUID id, UpdatePatientRequest request);

    void deletePatient(UUID id);
}