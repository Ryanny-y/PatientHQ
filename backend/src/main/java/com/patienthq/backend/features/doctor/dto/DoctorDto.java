package com.patienthq.backend.features.doctor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorDto {
    private UUID id;
    private String username;
    private Boolean isActive;
    private String fullName;
    private String specialization;
    private String licenseNumber;
    private String contactNumber;
    private String email;
}
