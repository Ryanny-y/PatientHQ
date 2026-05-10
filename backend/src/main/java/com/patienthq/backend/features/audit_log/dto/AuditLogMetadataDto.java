package com.patienthq.backend.features.audit_log.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLogMetadataDto {
    private long totalLogsToday;
    private long failedLoginAttempts;
    private long criticalActions;
    private long activeUsersToday;
}
