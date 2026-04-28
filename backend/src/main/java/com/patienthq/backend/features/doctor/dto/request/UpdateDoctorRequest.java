package com.patienthq.backend.features.doctor.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateDoctorRequest {

    @NotBlank(message = "Username must not be empty.")
    @Size(max = 100, message = "Username must not exceed 100 characters.")
    private String username;

    @NotBlank(message = "Full name cannot be blank")
    @Size(max = 100, message = "Full name must not exceed 100 characters")
    private String fullName;

    @NotBlank(message = "License number cannot be blank")
    @Size(max = 100, message = "License number must not exceed 100 characters")
    private String licenseNumber;

    @NotBlank(message = "Specialization cannot be blank")
    @Size(max = 100, message = "Specialization must not exceed 100 characters")
    private String specialization;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String email;

    @NotBlank(message = "Contact number cannot be blank")
    @Size(max = 20, message = "Contact number must not exceed 20 characters")
    @Pattern(
            regexp = "^[0-9+\\-()\\s]*$",
            message = "Contact number contains invalid characters"
    )
    private String contactNumber;

    private Boolean isActive;
}