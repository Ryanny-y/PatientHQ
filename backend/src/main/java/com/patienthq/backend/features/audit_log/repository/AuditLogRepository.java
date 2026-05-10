package com.patienthq.backend.features.audit_log.repository;

import com.patienthq.backend.features.audit_log.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.UUID;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, UUID>, JpaSpecificationExecutor<AuditLog> {

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
