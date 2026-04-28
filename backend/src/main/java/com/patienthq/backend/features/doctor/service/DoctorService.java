package com.patienthq.backend.features.doctor.service;

import com.patienthq.backend.features.doctor.dto.request.CreateDoctorRequest;
import com.patienthq.backend.features.doctor.dto.request.UpdateDoctorRequest;
import com.patienthq.backend.features.doctor.model.Doctor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface DoctorService {
    Doctor createDoctor(CreateDoctorRequest request);
    Page<Doctor> getAllDoctors(Pageable pageable);
    Doctor getDoctorById(UUID id);
    Doctor updateDoctor(UUID id, UpdateDoctorRequest request);
    void deleteDoctor(UUID id);
}
