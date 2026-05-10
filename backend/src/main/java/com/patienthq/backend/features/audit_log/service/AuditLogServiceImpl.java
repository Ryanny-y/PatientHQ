package com.patienthq.backend.features.audit_log.service;

import com.patienthq.backend.features.audit_log.AuditLogMapper;
import com.patienthq.backend.features.audit_log.dto.AuditLogDto;
import com.patienthq.backend.features.audit_log.dto.AuditLogMetadataDto;
import com.patienthq.backend.features.audit_log.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final AuditLogMapper auditLogMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<AuditLogDto> getAuditLogs(
            String search,
            String role,
            String entityType,
            String severity,
            String ipAddress,
            LocalDate dateFrom,
            LocalDate dateTo,
            Pageable pageable
    ) {
        String formattedSearch = search == null || search.isBlank()
                ? null
                : "%" + search.trim().toLowerCase() + "%";
        String formattedRole = role == null || role.equalsIgnoreCase("All")
                ? null
                : role.trim().toLowerCase();
        String formattedEntityType = entityType == null || entityType.equalsIgnoreCase("All")
                ? null
                : entityType.trim();
        String formattedSeverity = severity == null || severity.equalsIgnoreCase("All")
                ? null
                : severity.trim().toLowerCase();
        String formattedIpAddress = ipAddress == null || ipAddress.isBlank()
                ? null
                : "%" + ipAddress.trim() + "%";
        LocalDateTime from = dateFrom == null ? null : dateFrom.atStartOfDay();
        LocalDateTime to = dateTo == null ? null : dateTo.plusDays(1).atStartOfDay();

        return auditLogRepository.findFiltered(
                formattedSearch,
                formattedRole,
                formattedEntityType,
                formattedSeverity,
                formattedIpAddress,
                from,
                to,
                pageable
        ).map(auditLogMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public AuditLogMetadataDto getMetadata() {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();

        return AuditLogMetadataDto.builder()
                .totalLogsToday(auditLogRepository.countByCreatedAtBetween(start, end))
                .failedLoginAttempts(auditLogRepository.countByCreatedAtBetweenAndActionIgnoreCase(start, end, "LOGIN_FAILED"))
                .criticalActions(auditLogRepository.countCriticalBetween(start, end))
                .activeUsersToday(auditLogRepository.countActiveUsersBetween(start, end))
                .build();
    }
}
