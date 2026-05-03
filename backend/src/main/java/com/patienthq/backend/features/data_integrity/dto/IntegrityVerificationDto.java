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
public class IntegrityVerificationDto {

    private UUID patientId;
    private String patientName;
    private IntegrityStatus status;
    private String currentHash;
    private String storedHash;
    private boolean isValid;
    private LocalDateTime verifiedAt;
}
