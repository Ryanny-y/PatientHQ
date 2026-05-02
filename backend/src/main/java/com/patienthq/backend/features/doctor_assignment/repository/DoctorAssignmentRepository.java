package com.patienthq.backend.features.doctor_assignment.repository;

import com.patienthq.backend.features.doctor_assignment.model.DoctorAssignment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DoctorAssignmentRepository extends JpaRepository<DoctorAssignment, UUID> {

    @Query("""
        SELECT da FROM DoctorAssignment da
        LEFT JOIN FETCH da.patient p
        LEFT JOIN FETCH da.doctor d
        LEFT JOIN FETCH d.user u
        WHERE da.isActive = true
    """)
    Page<DoctorAssignment> findAllActiveAssignments(Pageable pageable);

    @Query("""
        SELECT da FROM DoctorAssignment da
        LEFT JOIN FETCH da.patient p
        LEFT JOIN FETCH da.doctor d
        LEFT JOIN FETCH d.user u
    """)
    Page<DoctorAssignment> findAllAssignments(Pageable pageable);

    @Query("""
        SELECT da FROM DoctorAssignment da
        LEFT JOIN FETCH da.patient p
        LEFT JOIN FETCH da.doctor d
        LEFT JOIN FETCH d.user u
        WHERE da.doctor.doctorId = :doctorId AND da.isActive = true
    """)
    List<DoctorAssignment> findActiveAssignmentsByDoctorId(@Param("doctorId") UUID doctorId);

    boolean existsByPatientPatientIdAndIsActiveTrue(UUID patientId);

    boolean existsByDoctorDoctorIdAndPatientPatientIdAndIsActiveTrue(UUID doctorId, UUID patientId);

    @Query("SELECT COUNT(da) FROM DoctorAssignment da WHERE da.isActive = true")
    long countActiveAssignments();

    @Query("""
        SELECT COUNT(DISTINCT p.patientId) FROM Patient p
        WHERE NOT EXISTS (
            SELECT 1 FROM DoctorAssignment da
            WHERE da.patient.patientId = p.patientId AND da.isActive = true
        )
    """)
    long countUnassignedPatients();

    @Query(value = """
        SELECT COUNT(DISTINCT d.doctor_id) FROM doctor_profiles d
        WHERE d.user_id IN (SELECT user_id FROM users WHERE is_active = true)
        AND d.doctor_id NOT IN (
            SELECT da.doctor_id FROM doctor_assignments da
            WHERE da.is_active = true
            GROUP BY da.doctor_id
            HAVING COUNT(*) >= 10
        )
    """, nativeQuery = true)
    long countAvailableDoctors();

    @Query(value = """
        SELECT COUNT(*) FROM (
            SELECT da.doctor_id
            FROM doctor_assignments da
            WHERE da.is_active = true
            GROUP BY da.doctor_id
            HAVING COUNT(*) >= 10
        ) AS high_workload
    """, nativeQuery = true)
    long countHighWorkloadDoctors();
}