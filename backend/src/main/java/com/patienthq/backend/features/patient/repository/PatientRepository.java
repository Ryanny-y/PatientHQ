package com.patienthq.backend.features.patient.repository;

import com.patienthq.backend.features.patient.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PatientRepository extends JpaRepository<Patient, UUID>, PagingAndSortingRepository<Patient, UUID> {
}
