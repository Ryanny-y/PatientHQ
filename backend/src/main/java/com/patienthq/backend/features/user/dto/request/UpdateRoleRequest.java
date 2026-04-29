package com.patienthq.backend.features.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateRoleRequest {
    @NotBlank(message = "Role name is required.")
    @Size(min = 3, max = 100, message = "Role name must be between {min} and {max} length.")
    private String roleName;
}
