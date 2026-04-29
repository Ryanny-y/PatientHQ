package com.patienthq.backend.features.admin.repository;

import com.patienthq.backend.features.admin.model.Admin;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.UUID;

@Repository
public interface AdminRepository extends JpaRepository<Admin, UUID>, PagingAndSortingRepository<Admin, UUID> {
    @Query("""
        SELECT a FROM Admin a
        LEFT JOIN a.user u
        WHERE (:isActive IS NULL OR u.isActive = :isActive)
        AND (
            :search IS NULL OR
            LOWER(a.fullName) LIKE :search OR
            LOWER(u.username) LIKE :search OR
            LOWER(a.email) LIKE :search
        )
    """)
    Page<Admin> findAllAdmins(
            @Param("isActive") Boolean isActive,
            @Param("search") String search,
            Pageable pageable
    );

    long countByUserIsActiveTrue();

    long countByUserIsActiveFalse();

    @Query("""
        SELECT COUNT(a) FROM Admin a
        JOIN a.user u
        WHERE u.createdAt >= :start
        AND u.createdAt < :end
    """)
    long countByUserCreatedAtBetween(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
}
