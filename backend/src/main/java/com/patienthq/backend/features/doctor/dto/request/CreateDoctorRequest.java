package com.patienthq.backend.features.doctor.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateDoctorRequest {
//    User fields
    private String username;
    private String password;
    private String confirmPassword;

    private String fullName;
    private String licenseNumber;
    private String specialization;
    private String email;
    private String contactNumber;

}
