package com.patienthq.backend.features.admin.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateAdminRequest {

    // User Fields
    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Confirm password is required")
    private String confirmPassword;

    // Admin Fields
    @NotBlank(message = "Full name is required")
    private String fullName;

    private String contactNumber;

    @Email(message = "Invalid email format")
    private String email;
}
