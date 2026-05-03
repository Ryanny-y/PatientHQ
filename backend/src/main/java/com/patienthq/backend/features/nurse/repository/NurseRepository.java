package com.patienthq.backend.features.nurse.repository;

import com.patienthq.backend.features.nurse.model.Nurse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface NurseRepository extends JpaRepository<Nurse, UUID> {
    boolean existsByLicenseNumber(String licenseNumber);

    boolean existsByLicenseNumberAndNurseIdNot(String licenseNumber, UUID id);

    @Query("""
        SELECT n FROM Nurse n
        LEFT JOIN n.user u
        WHERE (:isActive IS NULL OR u.isActive = :isActive)
        AND (:assignedWard IS NULL OR LOWER(n.assignedWard) LIKE :assignedWard)
        AND (
            :search IS NULL OR
            LOWER(n.fullName) LIKE :search OR
            LOWER(u.username) LIKE :search OR
            LOWER(n.email) LIKE :search
        )
    """)
    Page<Nurse> findAllNurses(
            @Param("isActive") Boolean isActive,
            @Param("assignedWard") String assignedWard,
            @Param("search") String search,
            Pageable pageable
    );

    long countByUserIsActiveTrue();

    long countByUserIsActiveFalse();

    @Query("SELECT DISTINCT n.assignedWard FROM Nurse n WHERE n.assignedWard IS NOT NULL AND n.assignedWard <> '' ORDER BY n.assignedWard ASC")
    java.util.List<String> findDistinctAssignedWards();
}

