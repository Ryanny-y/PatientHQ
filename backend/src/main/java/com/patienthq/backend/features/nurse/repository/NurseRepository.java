package com.patienthq.backend.features.nurse.repository;

import com.patienthq.backend.features.nurse.model.Nurse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface NurseRepository extends JpaRepository<Nurse, UUID>, PagingAndSortingRepository<Nurse, UUID> {
    boolean existsByLicenseNumber(String licenseNumber);

    boolean existsByLicenseNumberAndNurseIdNot(String licenseNumber, UUID id);
}

