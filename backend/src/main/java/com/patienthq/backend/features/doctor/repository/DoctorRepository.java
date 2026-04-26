package com.patienthq.backend.features.doctor.repository;

import com.patienthq.backend.features.doctor.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, UUID> {
    Boolean existsByLicenseNumber(String licenseNumber);
}
