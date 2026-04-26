package com.patienthq.backend.features.doctor.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateDoctorRequest {
    private String fullName;
    private String licenseNumber;
    private String specialization;
    private String email;
    private String contactNumber;

    private Boolean isActive;
}
