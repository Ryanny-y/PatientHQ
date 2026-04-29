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
public class CreatePermissionRequest {
    @NotBlank(message = "Permission name is required.")
    @Size(min = 3, max = 10, message = "Permission name must be between {min} and {max} length.")
    private String permissionName;
    private String description;
}
