package com.patienthq.backend.features.admin.dto;

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
public class AdminDto {
    // User Fields
    private UUID userId;
    private String username;
    private String roleName;
    private Boolean isActive;
    private LocalDateTime createdAt;

    //  Admin Fields
    private String adminId;
    private String fullName;
    private String contactNumber;
    private String email;
}
