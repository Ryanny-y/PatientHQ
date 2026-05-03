package com.patienthq.backend.features.data_integrity.repository;

import com.patienthq.backend.features.data_integrity.model.DataIntegrity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface DataIntegrityRepository extends JpaRepository<DataIntegrity, UUID> {

    @Query("""
        SELECT di FROM DataIntegrity di
        LEFT JOIN FETCH di.patient p
        WHERE p.patientId = :patientId
    """)
    Optional<DataIntegrity> findByPatientId(@Param("patientId") UUID patientId);

    @Modifying
    @Query("""
        UPDATE DataIntegrity di
        SET di.status = 'PENDING'
        WHERE di.patient.patientId = :patientId
    """)
    void markAsPending(@Param("patientId") UUID patientId);

    boolean existsByPatientPatientId(UUID patientId);
}
