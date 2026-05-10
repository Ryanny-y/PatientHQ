package com.patienthq.backend.features.dashboard;

import com.patienthq.backend.features.dashboard.dto.DashboardDto;
import com.patienthq.backend.features.dashboard.service.DashboardService;
import com.patienthq.backend.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<ApiResponse<DashboardDto>> getDashboard() {
        return ResponseEntity.ok(
                ApiResponse.<DashboardDto>builder()
                        .success(true)
                        .message("Dashboard retrieved successfully")
                        .data(dashboardService.getDashboard())
                        .build()
        );
    }
}
