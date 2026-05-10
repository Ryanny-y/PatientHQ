package com.patienthq.backend.features.vital_signs.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VitalSignsDto {
    private UUID vitalId;
    private UUID patientId;
    private UUID recordedBy;
    private String patientName;
    private String recordedByName;
    private BigDecimal temperature;
    private Integer heartRate;
    private Integer respiratoryRate;
    private BigDecimal oxygenSaturation;
    private String bloodPressure;
    private String notes;
    private LocalDateTime recordedAt;
}
