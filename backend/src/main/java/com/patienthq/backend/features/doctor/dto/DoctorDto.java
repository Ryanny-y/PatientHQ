package com.patienthq.backend.features.doctor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorDto {
    //    User Field
    private UUID userId;
    private String username;
    private String roleName;
    private Boolean isActive;
    private LocalDateTime createdAt;

    //    Doctor Field
    private UUID doctorId;
    private String fullName;
    private String specialization;
    private String licenseNumber;
    private String contactNumber;
    private String email;
}
