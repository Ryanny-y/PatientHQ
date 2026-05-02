package com.patienthq.backend.features.report;

import com.patienthq.backend.features.report.dto.ReportDto;
import com.patienthq.backend.features.report.dto.request.GenerateReportRequest;
import com.patienthq.backend.features.report.service.ReportService;
import com.patienthq.backend.shared.response.ApiResponse;
import com.patienthq.backend.shared.response.PageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<ReportDto>> generateReport(
            @Valid @RequestBody GenerateReportRequest request) {
        ReportDto report = reportService.generateReport(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<ReportDto>builder()
                        .success(true)
                        .message("Report generated successfully")
                        .data(report)
                        .build()
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ReportDto>>> getAllReports(Pageable pageable) {
        Page<ReportDto> page = reportService.getAllReports(pageable);
        PageResponse<ReportDto> pageResponse = PageResponse.<ReportDto>builder()
                .content(page.getContent())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
        return ResponseEntity.ok(
                ApiResponse.<PageResponse<ReportDto>>builder()
                        .success(true)
                        .message("Reports retrieved successfully")
                        .data(pageResponse)
                        .build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ReportDto>> getReportById(@PathVariable UUID id) {
        ReportDto report = reportService.getReportById(id);
        return ResponseEntity.ok(
                ApiResponse.<ReportDto>builder()
                        .success(true)
                        .message("Report retrieved successfully")
                        .data(report)
                        .build()
        );
    }
}
