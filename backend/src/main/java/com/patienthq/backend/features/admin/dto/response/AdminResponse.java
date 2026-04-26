package com.patienthq.backend.features.admin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminResponse {
    private UUID id;
    private String fullName;
    private String contactNumber;
    private String email;
    
    // User fields
    private UUID userId;
    private String username;
    private String roleName;
    private Boolean isActive;
    private LocalDateTime userCreatedAt;
}
