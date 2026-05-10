package com.patienthq.backend.features.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatCardDto {
    private String title;
    private Object value;
    private String change;
    private String trend;
    private String icon;
    private String color;
}
