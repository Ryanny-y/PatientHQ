package com.patienthq.backend.features.audit_log.service;

import com.patienthq.backend.features.audit_log.dto.AuditLogDto;
import com.patienthq.backend.features.audit_log.dto.AuditLogMetadataDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface AuditLogService {
    Page<AuditLogDto> getAuditLogs(
            String search,
            String role,
            String entityType,
            String severity,
            String ipAddress,
            LocalDate dateFrom,
            LocalDate dateTo,
            Pageable pageable
    );

    AuditLogMetadataDto getMetadata();
}
