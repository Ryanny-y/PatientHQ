package com.patienthq.backend.features.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SecurityStatusItemDto {
    private String label;
    private String status;
    private String description;
}
