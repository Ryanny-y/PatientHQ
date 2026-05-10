package com.patienthq.backend.features.vital_signs;

import com.patienthq.backend.features.vital_signs.dto.VitalSignsDto;
import com.patienthq.backend.features.vital_signs.dto.VitalSignsMetadataDto;
import com.patienthq.backend.features.vital_signs.dto.request.CreateVitalSignsRequest;
import com.patienthq.backend.features.vital_signs.model.VitalSign;
import com.patienthq.backend.features.vital_signs.service.VitalSignsService;
import com.patienthq.backend.shared.response.ApiResponse;
import com.patienthq.backend.shared.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/vital-signs")
@RequiredArgsConstructor
public class VitalSignsController {

    private final VitalSignsService vitalSignsService;
    private final VitalSignsMapper vitalSignsMapper;

    @GetMapping
    @PreAuthorize("hasAuthority('VITAL_SIGNS_VIEW')")
    public ResponseEntity<ApiResponse<List<VitalSignsDto>>> getAllVitalSigns() {
        List<VitalSign> vitalSigns = vitalSignsService.getAllVitalSigns();
        List<VitalSignsDto> vitalSignsDtos = vitalSigns.stream().map(vitalSignsMapper::toDto).toList();
        return ResponseEntity.ok(
                ApiResponse.<List<VitalSignsDto>>builder()
                        .success(true)
                        .message("Vital signs retrieved successfully")
                        .data(vitalSignsDtos)
                        .build()
        );
    }

    @GetMapping("/meta")
    @PreAuthorize("hasAuthority('VITAL_SIGNS_VIEW')")
    public ResponseEntity<ApiResponse<VitalSignsMetadataDto>> getVitalSignsMetadata() {
        return ResponseEntity.ok(
                ApiResponse.<VitalSignsMetadataDto>builder()
                        .success(true)
                        .message("Vital signs metadata retrieved successfully")
                        .data(vitalSignsService.getVitalSignsMetadata())
                        .build()
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('VITAL_SIGNS_VIEW')")
    public ResponseEntity<ApiResponse<VitalSignsDto>> getVitalSignsById(@PathVariable UUID id) {
        VitalSign vitalSign = vitalSignsService.getVitalSignsById(id);
        return ResponseEntity.ok(
                ApiResponse.<VitalSignsDto>builder()
                        .success(true)
                        .message("Vital signs retrieved successfully")
                        .data(vitalSignsMapper.toDto(vitalSign))
                        .build()
        );
    }

    @PostMapping
    @PreAuthorize("hasAuthority('VITAL_SIGNS_CREATE') and hasRole('NURSE')")
    public ResponseEntity<ApiResponse<VitalSignsDto>> createVitalSigns(
            @Valid @RequestBody CreateVitalSignsRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        VitalSign createdVitalSign = vitalSignsService.createVitalSigns(request, userPrincipal.getUser());
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<VitalSignsDto>builder()
                        .success(true)
                        .message("Vital signs created successfully")
                        .data(vitalSignsMapper.toDto(createdVitalSign))
                        .build()
        );
    }
}
