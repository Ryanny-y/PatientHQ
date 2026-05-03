package com.patienthq.backend.features.medical_record.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateMedicalRecordRequest {
    private String diagnosis;
    private String treatment;
    private String prescription;
    private String notes;
}
