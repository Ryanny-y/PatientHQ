package com.patienthq.backend.features.patient.service;

import com.patienthq.backend.features.patient.dto.request.CreatePatientRequest;
import com.patienthq.backend.features.patient.dto.request.UpdatePatientRequest;
import com.patienthq.backend.features.patient.model.Patient;

import java.util.List;
import java.util.UUID;

public interface PatientService {

    Patient createPatient(CreatePatientRequest request);

    List<Patient> getAllPatients();

    Patient getPatientById(UUID id);

    Patient updatePatient(UUID id, UpdatePatientRequest request);

    void deletePatient(UUID id);
}