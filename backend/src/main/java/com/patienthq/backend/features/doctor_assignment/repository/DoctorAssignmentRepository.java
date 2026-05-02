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
        WHERE da.patient.patientId = :patientId AND da.isActive = true
    """)
    Optional<DoctorAssignment> findActiveAssignmentByPatientId(@Param("patientId") UUID patientId);

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
}