package com.patienthq.backend.features.medical_record.repository;

import com.patienthq.backend.features.medical_record.model.MedicalRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, UUID> {

    @Query("""
            SELECT m FROM MedicalRecord m
            WHERE m.patientId = :patientId
            ORDER BY m.createdAt DESC
            """)
    List<MedicalRecord> findByPatientId(@Param("patientId") UUID patientId);

    @Query("""
            SELECT m FROM MedicalRecord m
            WHERE m.doctorId = :doctorId
            ORDER BY m.createdAt DESC
            """)
    List<MedicalRecord> findByDoctorId(@Param("doctorId") UUID doctorId);

    @Query("""
            SELECT m FROM MedicalRecord m
            WHERE m.patientId = :patientId AND m.doctorId = :doctorId
            ORDER BY m.createdAt DESC
            """)
    List<MedicalRecord> findByPatientIdAndDoctorId(
            @Param("patientId") UUID patientId,
            @Param("doctorId") UUID doctorId
    );

    @Query("""
            SELECT m FROM MedicalRecord m
            WHERE (:patientId IS NULL OR m.patientId = :patientId)
            AND (:doctorId IS NULL OR m.doctorId = :doctorId)
            AND (:search IS NULL OR 
                LOWER(m.diagnosis) LIKE :search OR
                LOWER(m.treatment) LIKE :search OR
                LOWER(m.notes) LIKE :search)
            ORDER BY m.createdAt DESC
            """)
    Page<MedicalRecord> findAllWithFilters(
            @Param("patientId") UUID patientId,
            @Param("doctorId") UUID doctorId,
            @Param("search") String search,
            Pageable pageable
    );

    long countByPatientId(UUID patientId);

    long countByDoctorId(UUID doctorId);

    @Query("SELECT COUNT(DISTINCT m.patientId) FROM MedicalRecord m")
    long countDistinctPatients();

    @Query("SELECT COUNT(DISTINCT m.doctorId) FROM MedicalRecord m")
    long countDistinctDoctors();

    @Query("SELECT COUNT(m) FROM MedicalRecord m WHERE m.createdAt >= :startOfWeek")
    long countRecordsCreatedThisWeek(@Param("startOfWeek") LocalDateTime startOfWeek);
}
