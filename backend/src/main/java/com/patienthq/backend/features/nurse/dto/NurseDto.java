package com.patienthq.backend.features.nurse.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NurseDto {
    //    user Field
    private UUID userId;
    private String username;
    private String roleName;
    private Boolean isActive;
    private LocalDateTime createdAt;

    //    Nurse Field
    private UUID nurseId;
    private String fullName;
    private String assignedWard;
    private String licenseNumber;
    private String contactNumber;
    private String email;
}
