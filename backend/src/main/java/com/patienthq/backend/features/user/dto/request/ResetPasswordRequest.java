package com.patienthq.backend.features.user.dto.request;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResetPasswordRequest {
    @NotBlank(message = "New password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(regexp = ".*[A-Z].*", message = "Must contain an uppercase letter")
    @Pattern(regexp = ".*[0-9].*", message = "Must contain a number")
    @Pattern(regexp = ".*[^A-Za-z0-9].*", message = "Must contain a special character")
    @JsonAlias({"new_password", "password"})
    private String newPassword;

    @NotBlank(message = "Please confirm your password")
    @JsonAlias("confirm_password")
    private String confirmPassword;

    @AssertTrue(message = "Passwords do not match")
    public boolean isPasswordConfirmed() {
        return newPassword != null && newPassword.equals(confirmPassword);
    }
}
