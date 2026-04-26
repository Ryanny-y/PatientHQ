package com.patienthq.backend.features.nurse.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NurseDto {
    private UUID nurseId;
    private String username;
    private Boolean isActive;
    private String fullName;
    private String assignedWard;
    private String licenseNumber;
    private String contactNumber;
    private String email;
}
