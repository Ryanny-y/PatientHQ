package com.patienthq.backend.features.appointment.repository;

import com.patienthq.backend.features.appointment.model.Appointment;
import com.patienthq.backend.features.appointment.model.AppointmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.UUID;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {

    @Query("""
                SELECT a FROM Appointment a
                LEFT JOIN FETCH a.patient p
                LEFT JOIN FETCH a.doctor d
                WHERE (
                    :search IS NULL OR
                    LOWER(p.fullName) LIKE :search OR
                    LOWER(d.fullName) LIKE :search
                )
                AND (:status IS NULL OR a.status = :status)
                AND (:patientId IS NULL OR p.patientId = :patientId)
                AND (:doctorId IS NULL OR d.doctorId = :doctorId)
            """)
    Page<Appointment> findAllAppointments(String search, AppointmentStatus status, UUID patientId, UUID doctorId, Pageable pageable);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.status = :status")
    long countByStatus(AppointmentStatus status);

    @Query("""
            SELECT COUNT(a) FROM Appointment a 
            WHERE a.appointmentDate >= :startOfDay 
            AND a.appointmentDate < :endOfDay
            """)
    long countTodaysAppointments(LocalDateTime startOfDay, LocalDateTime endOfDay);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.status = 'COMPLETED' AND a.appointmentDate >= :startOfWeek")
    long countCompletedThisWeek(java.time.LocalDateTime startOfWeek);
}
