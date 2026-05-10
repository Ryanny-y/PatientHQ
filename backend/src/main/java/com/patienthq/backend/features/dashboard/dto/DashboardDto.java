package com.patienthq.backend.features.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDto {
    private List<StatCardDto> stats;
    private List<ActivityItemDto> activities;
    private List<SecurityStatusItemDto> securityStatus;
    private List<RecentPatientDto> recentPatients;
}
