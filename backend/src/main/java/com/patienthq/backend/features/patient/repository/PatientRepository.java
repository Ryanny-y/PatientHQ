package com.patienthq.backend.features.patient.repository;

import com.patienthq.backend.features.patient.model.Patient;
import com.patienthq.backend.features.patient.model.PatientStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PatientRepository extends JpaRepository<Patient, UUID>, PagingAndSortingRepository<Patient, UUID> {
    @Query("""
        SELECT p FROM Patient p
        WHERE (:search IS NULL OR
               LOWER(p.fullName) LIKE :search OR
               LOWER(p.email) LIKE :search OR
               LOWER(p.contactNumber) LIKE :search)
        AND (:status IS NULL OR p.status = :status)
        AND (:gender IS NULL OR LOWER(p.gender) = :gender)
        AND (:bloodType IS NULL OR LOWER(p.bloodType) = :bloodType)
    """)
    Page<Patient> findAllPatients(
            @Param("search") String search,
            @Param("status") PatientStatus status,
            @Param("gender") String gender,
            @Param("bloodType") String bloodType,
            Pageable pageable
    );
}
