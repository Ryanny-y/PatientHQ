package com.patienthq.backend.features.vital_signs.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VitalSignsMetadataDto {
    private long totalRecords;
    private long recordedToday;
    private long criticalCount;
    private long patientsMonitored;
}
