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
public class CreateNurseRequest {

    // User fields
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 100, message = "Password must be at least 8 characters long")
    @Pattern(
            regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).+$",
            message = "Password must contain upper, lower case letters and a number"
    )
    private String password;

    @NotBlank(message = "Confirm password is required")
    private String confirmPassword;

    // Nurse profile fields
    @NotBlank(message = "Full name is required")
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
}