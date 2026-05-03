package com.patienthq.backend.features.data_integrity;

import com.patienthq.backend.features.data_integrity.dto.DataIntegrityDto;
import com.patienthq.backend.features.data_integrity.dto.IntegrityVerificationDto;
import com.patienthq.backend.features.data_integrity.service.PatientIntegrityService;
import com.patienthq.backend.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/patients/{patientId}/integrity")
@RequiredArgsConstructor
public class DataIntegrityController {

    private final PatientIntegrityService patientIntegrityService;

    @GetMapping
    public ResponseEntity<ApiResponse<DataIntegrityDto>> getIntegrity(@PathVariable UUID patientId) {
        DataIntegrityDto integrity = patientIntegrityService.getIntegrity(patientId);
        return ResponseEntity.ok(
                ApiResponse.<DataIntegrityDto>builder()
                        .success(true)
                        .message("Data integrity retrieved successfully")
                        .data(integrity)
                        .build()
        );
    }

    @GetMapping("/verify")
    public ResponseEntity<ApiResponse<IntegrityVerificationDto>> verifyIntegrity(@PathVariable UUID patientId) {
        IntegrityVerificationDto verification = patientIntegrityService.verifyIntegrity(patientId);
        return ResponseEntity.ok(
                ApiResponse.<IntegrityVerificationDto>builder()
                        .success(true)
                        .message("Integrity verification completed")
                        .data(verification)
                        .build()
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DataIntegrityDto>> recomputeIntegrity(@PathVariable UUID patientId) {
        DataIntegrityDto integrity = patientIntegrityService.recomputeIntegrity(patientId);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<DataIntegrityDto>builder()
                        .success(true)
                        .message("Data integrity recomputed successfully")
                        .data(integrity)
                        .build()
        );
    }
}
