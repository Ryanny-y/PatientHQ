package com.patienthq.backend.features.data_integrity.service;

import com.patienthq.backend.features.data_integrity.dto.DataIntegrityDto;
import com.patienthq.backend.features.data_integrity.dto.IntegrityVerificationDto;

import java.util.UUID;

public interface PatientIntegrityService {

    DataIntegrityDto getIntegrity(UUID patientId);

    IntegrityVerificationDto verifyIntegrity(UUID patientId);

    DataIntegrityDto recomputeIntegrity(UUID patientId);

    void markPending(UUID patientId);
}
