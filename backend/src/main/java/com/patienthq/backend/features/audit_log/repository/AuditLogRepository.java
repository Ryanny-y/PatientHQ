package com.patienthq.backend.features.audit_log.repository;

import com.patienthq.backend.features.audit_log.model.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.UUID;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {

    @EntityGraph(attributePaths = {"user", "user.role"})
    @Query("""
            SELECT a FROM AuditLog a
            JOIN a.user u
            JOIN u.role r
            WHERE (:search IS NULL OR
                   LOWER(CAST(a.logId AS string)) LIKE :search OR
                   LOWER(u.username) LIKE :search OR
                   LOWER(a.action) LIKE :search OR
                   LOWER(a.entityType) LIKE :search OR
                   LOWER(COALESCE(a.description, '')) LIKE :search)
            AND (:role IS NULL OR LOWER(r.roleName) = :role OR LOWER(r.roleName) = CONCAT('role_', :role))
            AND (:entityType IS NULL OR a.entityType = :entityType)
            AND (:ipAddress IS NULL OR a.ipAddress LIKE :ipAddress)
            AND (:fromDate IS NULL OR a.createdAt >= :fromDate)
            AND (:toDate IS NULL OR a.createdAt < :toDate)
            AND (
                :severity IS NULL
                OR (:severity = 'critical' AND (
                    LOWER(a.action) LIKE '%failed%'
                    OR LOWER(a.action) LIKE '%delete%'
                    OR LOWER(a.action) LIKE '%critical%'
                    OR LOWER(COALESCE(a.description, '')) LIKE '%failed%'
                    OR LOWER(COALESCE(a.description, '')) LIKE '%unauthorized%'
                    OR LOWER(COALESCE(a.description, '')) LIKE '%critical%'
                ))
                OR (:severity = 'warning' AND (
                    LOWER(a.action) LIKE '%update%'
                    OR LOWER(a.action) LIKE '%create%'
                    OR LOWER(a.action) LIKE '%reset%'
                    OR LOWER(COALESCE(a.description, '')) LIKE '%pending%'
                ))
                OR (:severity = 'info' AND (
                    LOWER(a.action) NOT LIKE '%failed%'
                    AND LOWER(a.action) NOT LIKE '%delete%'
                    AND LOWER(a.action) NOT LIKE '%critical%'
                    AND LOWER(a.action) NOT LIKE '%update%'
                    AND LOWER(a.action) NOT LIKE '%create%'
                    AND LOWER(a.action) NOT LIKE '%reset%'
                    AND LOWER(COALESCE(a.description, '')) NOT LIKE '%failed%'
                    AND LOWER(COALESCE(a.description, '')) NOT LIKE '%unauthorized%'
                    AND LOWER(COALESCE(a.description, '')) NOT LIKE '%critical%'
                    AND LOWER(COALESCE(a.description, '')) NOT LIKE '%pending%'
                ))
            )
            """)
    Page<AuditLog> findFiltered(
            @Param("search") String search,
            @Param("role") String role,
            @Param("entityType") String entityType,
            @Param("severity") String severity,
            @Param("ipAddress") String ipAddress,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            Pageable pageable
    );

    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    long countByCreatedAtBetweenAndActionIgnoreCase(LocalDateTime start, LocalDateTime end, String action);

    @Query("""
            SELECT COUNT(a) FROM AuditLog a
            WHERE a.createdAt >= :start AND a.createdAt < :end
            AND (
                LOWER(a.action) LIKE '%failed%'
                OR LOWER(a.action) LIKE '%delete%'
                OR LOWER(a.action) LIKE '%critical%'
                OR LOWER(COALESCE(a.description, '')) LIKE '%failed%'
                OR LOWER(COALESCE(a.description, '')) LIKE '%unauthorized%'
                OR LOWER(COALESCE(a.description, '')) LIKE '%critical%'
            )
            """)
    long countCriticalBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("""
            SELECT COUNT(DISTINCT a.user.userId) FROM AuditLog a
            WHERE a.createdAt >= :start AND a.createdAt < :end
            """)
    long countActiveUsersBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
