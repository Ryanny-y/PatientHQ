package com.patienthq.backend.features.nurse.service;

import com.patienthq.backend.features.nurse.dto.request.CreateNurseRequest;
import com.patienthq.backend.features.nurse.dto.request.UpdateNurseRequest;
import com.patienthq.backend.features.nurse.model.Nurse;

import java.util.List;
import java.util.UUID;

public interface NurseService {
    Nurse createNurse(CreateNurseRequest request);
    List<Nurse> getAllNurses();
    Nurse getNurseById(UUID id);
    Nurse updateNurse(UUID id, UpdateNurseRequest request);
    void deleteNurse(UUID id);
}
