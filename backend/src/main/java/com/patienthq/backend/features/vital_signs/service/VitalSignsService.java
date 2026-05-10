package com.patienthq.backend.features.vital_signs.service;

import com.patienthq.backend.features.user.model.User;
import com.patienthq.backend.features.vital_signs.dto.VitalSignsMetadataDto;
import com.patienthq.backend.features.vital_signs.dto.request.CreateVitalSignsRequest;
import com.patienthq.backend.features.vital_signs.model.VitalSign;

import java.util.List;
import java.util.UUID;

public interface VitalSignsService {
    List<VitalSign> getAllVitalSigns();
    VitalSign getVitalSignsById(UUID id);
    VitalSignsMetadataDto getVitalSignsMetadata();
    VitalSign createVitalSigns(CreateVitalSignsRequest request, User currentUser);
}
