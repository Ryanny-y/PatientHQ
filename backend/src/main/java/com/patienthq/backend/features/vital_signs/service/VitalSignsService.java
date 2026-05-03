package com.patienthq.backend.features.vital_signs.service;

import com.patienthq.backend.features.vital_signs.dto.request.CreateVitalSignsRequest;
import com.patienthq.backend.features.vital_signs.model.VitalSign;

import java.util.List;
import java.util.UUID;

public interface VitalSignsService {
    List<VitalSign> getAllVitalSigns();
    VitalSign getVitalSignsById(UUID id);
    VitalSign createVitalSigns(CreateVitalSignsRequest request);
}
