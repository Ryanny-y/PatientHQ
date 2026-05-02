package com.patienthq.backend.features.report.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportDto {

    private UUID reportId;
    private UUID patientId;
    private String patientName;
    private UUID generatedBy;
    private String generatedByUsername;
    private String reportType;
    private String summary;
    private LocalDateTime createdAt;
}
