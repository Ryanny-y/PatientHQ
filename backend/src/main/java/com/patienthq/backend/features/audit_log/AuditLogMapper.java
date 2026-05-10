package com.patienthq.backend.features.audit_log;

import com.patienthq.backend.features.audit_log.dto.AuditLogDto;
import com.patienthq.backend.features.audit_log.model.AuditLog;
import org.springframework.stereotype.Component;

@Component
public class AuditLogMapper {

    public AuditLogDto toDto(AuditLog log) {
        String roleName = log.getUser().getRole().getRoleName();

        return AuditLogDto.builder()
                .logId(log.getLogId())
                .userId(log.getUser().getUserId())
                .username(log.getUser().getUsername())
                .role(formatRole(roleName))
                .action(log.getAction())
                .entityType(defaultValue(log.getEntityType(), "UNKNOWN"))
                .entityId(log.getEntityId())
                .description(defaultValue(log.getDescription(), "No description recorded."))
                .ipAddress(defaultValue(log.getIpAddress(), "-"))
                .severity(resolveSeverity(log))
                .createdAt(log.getCreatedAt())
                .build();
    }

    private String formatRole(String roleName) {
        if (roleName == null || roleName.isBlank()) {
            return "Unknown";
        }

        String normalized = roleName.replace("ROLE_", "").toLowerCase();
        return normalized.substring(0, 1).toUpperCase() + normalized.substring(1);
    }

    private String resolveSeverity(AuditLog log) {
        String text = ((log.getAction() == null ? "" : log.getAction()) + " "
                + (log.getDescription() == null ? "" : log.getDescription())).toLowerCase();

        if (text.contains("failed") || text.contains("unauthorized")
                || text.contains("delete") || text.contains("critical")) {
            return "Critical";
        }

        if (text.contains("update") || text.contains("create")
                || text.contains("reset") || text.contains("pending")) {
            return "Warning";
        }

        return "Info";
    }

    private String defaultValue(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }
}
