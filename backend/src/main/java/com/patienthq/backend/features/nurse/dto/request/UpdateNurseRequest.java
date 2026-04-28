package com.patienthq.backend.features.nurse.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateNurseRequest {

    @Size(max = 100, message = "Username must not exceed 100 characters.")
    private String username;

    @Size(max = 100, message = "Full name must not exceed 100 characters")
    private String fullName;

    @Size(max = 100, message = "Assigned ward must not exceed 100 characters")
    private String assignedWard;

    @Size(max = 100, message = "License number must not exceed 100 characters")
    private String licenseNumber;

    @Size(max = 20, message = "Contact number must not exceed 20 characters")
    @Pattern(
            regexp = "^[0-9+\\-()\\s]*$",
            message = "Contact number contains invalid characters"
    )
    private String contactNumber;

    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String email;

    private Boolean isActive;
}