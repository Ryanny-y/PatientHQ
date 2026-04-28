package com.patienthq.backend.features.doctor.repository;

import com.patienthq.backend.features.doctor.model.Doctor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, UUID>, PagingAndSortingRepository<Doctor, UUID> {
    boolean existsByLicenseNumber(String licenseNumber);

    boolean existsByLicenseNumberAndDoctorIdNot(String licenseNumber, UUID doctorId);

    @Query("""
        SELECT d FROM Doctor d
        LEFT JOIN d.user u
        WHERE (:isActive IS NULL OR u.isActive = :isActive)
        AND (
            :search IS NULL OR
            LOWER(d.fullName) LIKE :search OR
            LOWER(u.username) LIKE :search OR
            LOWER(d.email) LIKE :search
        )
    """)
    Page<Doctor> findAllDoctors(
            @Param("isActive") Boolean isActive,
            @Param("search") String search,
            Pageable pageable
    );
}
