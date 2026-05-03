package com.patienthq.backend.features.medical_record.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateMedicalRecordRequest {
    @NotNull
    private UUID patientId;

    @NotNull
    private UUID doctorId;

    @NotBlank
    private String diagnosis;

    private String treatment;
    private String prescription;
    private String notes;
}
