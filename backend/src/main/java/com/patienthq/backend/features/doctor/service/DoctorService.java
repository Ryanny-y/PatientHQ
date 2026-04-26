package com.patienthq.backend.features.doctor.service;

import com.patienthq.backend.features.doctor.dto.DoctorDto;
import com.patienthq.backend.features.doctor.dto.request.CreateDoctorRequest;
import com.patienthq.backend.features.doctor.dto.request.UpdateDoctorRequest;
import com.patienthq.backend.features.doctor.model.Doctor;

import java.util.List;
import java.util.UUID;

public interface DoctorService {
    Doctor createDoctor(CreateDoctorRequest request);
    List<Doctor> getAllDoctors();
    Doctor getDoctorById(UUID id);
    Doctor updateDoctor(UUID id, UpdateDoctorRequest request);
    void deleteDoctor(UUID id);
}
