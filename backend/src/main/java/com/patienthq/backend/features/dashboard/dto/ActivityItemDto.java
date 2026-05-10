package com.patienthq.backend.features.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityItemDto {
    private String id;
    private String user;
    private String role;
    private String action;
    private String resource;
    private String time;
    private String status;
}
