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
public class UpdateAdminRequest {

    // Admin Fields
    @NotBlank(message = "Full name is required")
    private String fullName;

    private String contactNumber;

    @Email(message = "Invalid email format")
    private String email;

    // User Fields (Optional for update)
    private String username;
    private String password;
    private String confirmPassword;
}
