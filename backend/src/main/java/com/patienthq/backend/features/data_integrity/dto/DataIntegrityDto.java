package com.patienthq.backend.features.data_integrity.dto;

import com.patienthq.backend.features.data_integrity.model.IntegrityStatus;
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
public class DataIntegrityDto {

    private UUID integrityId;
    private UUID patientId;
    private String patientName;
    private String hashValue;
    private IntegrityStatus status;
    private LocalDateTime lastChecked;
}
