package com.patienthq.backend.features.medical_record.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicalRecordMetadataDto {

    private long totalRecords;
    private long newThisWeek;
    private long activePatients;
    private long totalDoctors;
}