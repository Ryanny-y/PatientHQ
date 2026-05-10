package com.patienthq.backend.features.vital_signs.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateVitalSignsRequest {
    @NotNull
    private UUID patientId;

    private UUID recordedBy;

    private BigDecimal temperature;
    private Integer heartRate;
    private Integer respiratoryRate;
    private BigDecimal oxygenSaturation;
    private String bloodPressure;
    private String notes;
}
