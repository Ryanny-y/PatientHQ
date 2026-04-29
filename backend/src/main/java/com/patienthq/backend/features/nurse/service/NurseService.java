package com.patienthq.backend.features.nurse.service;

import com.patienthq.backend.features.nurse.dto.NurseMetadataDto;
import com.patienthq.backend.features.nurse.dto.request.CreateNurseRequest;
import com.patienthq.backend.features.nurse.dto.request.UpdateNurseRequest;
import com.patienthq.backend.features.nurse.model.Nurse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface NurseService {
    Nurse createNurse(CreateNurseRequest request);
    Page<Nurse> getAllNurses(Boolean isActive, String search, Pageable pageable);
    NurseMetadataDto getNurseMetadata();
    Nurse getNurseById(UUID id);
    Nurse updateNurse(UUID id, UpdateNurseRequest request);
    void deleteNurse(UUID id);
}
