package com.patienthq.backend.features.report.service;

import com.patienthq.backend.features.report.dto.ReportDto;
import com.patienthq.backend.features.report.dto.request.GenerateReportRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface ReportService {

    ReportDto generateReport(GenerateReportRequest request);

    Page<ReportDto> getAllReports(Pageable pageable);

    ReportDto getReportById(UUID id);
}
