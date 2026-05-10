package com.patienthq.backend.features.audit_log.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLogDto {

    @JsonProperty("log_id")
    private UUID logId;

    @JsonProperty("user_id")
    private UUID userId;

    private String username;

    private String role;

    private String action;

    @JsonProperty("entity_type")
    private String entityType;

    @JsonProperty("entity_id")
    private UUID entityId;

    private String description;

    @JsonProperty("ip_address")
    private String ipAddress;

    private String severity;

    @JsonProperty("created_at")
    private LocalDateTime createdAt;
}
