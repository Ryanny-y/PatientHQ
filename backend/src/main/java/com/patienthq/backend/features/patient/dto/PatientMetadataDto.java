package com.patienthq.backend.features.patient.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientMetadataDto {
    private long totalPatients;
    private long activePatients;
    private long inactivePatients;
    private long newThisMonth;
}
