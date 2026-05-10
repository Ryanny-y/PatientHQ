package com.patienthq.backend.features.audit_log;

import com.patienthq.backend.features.audit_log.dto.AuditLogDto;
import com.patienthq.backend.features.audit_log.dto.AuditLogMetadataDto;
import com.patienthq.backend.features.audit_log.service.AuditLogService;
import com.patienthq.backend.shared.response.ApiResponse;
import com.patienthq.backend.shared.response.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping
    @PreAuthorize("hasAuthority('AUDIT_LOG_VIEW')")
    public ResponseEntity<ApiResponse<PageResponse<AuditLogDto>>> getAuditLogs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String entityType,
            @RequestParam(required = false) String severity,
            @RequestParam(required = false) String ipAddress,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            Pageable pageable
    ) {
        Page<AuditLogDto> auditLogs = auditLogService.getAuditLogs(
                search, role, entityType, severity, ipAddress, dateFrom, dateTo, pageable
        );

        PageResponse<AuditLogDto> pageResponse = PageResponse.<AuditLogDto>builder()
                .content(auditLogs.getContent())
                .page(auditLogs.getNumber())
                .size(auditLogs.getSize())
                .totalElements(auditLogs.getTotalElements())
                .totalPages(auditLogs.getTotalPages())
                .first(auditLogs.isFirst())
                .last(auditLogs.isLast())
                .build();

        return ResponseEntity.ok(
                ApiResponse.<PageResponse<AuditLogDto>>builder()
                        .success(true)
                        .message("Audit logs retrieved successfully")
                        .data(pageResponse)
                        .build()
        );
    }

    @GetMapping("/meta")
    @PreAuthorize("hasAuthority('AUDIT_LOG_VIEW')")
    public ResponseEntity<ApiResponse<AuditLogMetadataDto>> getAuditLogMetadata() {
        return ResponseEntity.ok(
                ApiResponse.<AuditLogMetadataDto>builder()
                        .success(true)
                        .message("Audit log metadata retrieved successfully")
                        .data(auditLogService.getMetadata())
                        .build()
        );
    }
}
