package com.patienthq.backend.features.medical_record;

import com.patienthq.backend.features.medical_record.dto.MedicalRecordDto;
import com.patienthq.backend.features.medical_record.dto.MedicalRecordMetadataDto;
import com.patienthq.backend.features.medical_record.dto.request.CreateMedicalRecordRequest;
import com.patienthq.backend.features.medical_record.dto.request.UpdateMedicalRecordRequest;
import com.patienthq.backend.features.medical_record.service.MedicalRecordService;
import com.patienthq.backend.shared.response.ApiResponse;
import com.patienthq.backend.shared.response.PageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/medical-records")
@RequiredArgsConstructor
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;

    @PostMapping
    public ResponseEntity<ApiResponse<MedicalRecordDto>> createMedicalRecord(
            @Valid @RequestBody CreateMedicalRecordRequest request) {
        MedicalRecordDto medicalRecord = medicalRecordService.createMedicalRecord(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<MedicalRecordDto>builder()
                        .success(true)
                        .message("Medical record created successfully")
                        .data(medicalRecord)
                        .build()
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<MedicalRecordDto>>> getAllMedicalRecords(
            @RequestParam(required = false) UUID patientId,
            @RequestParam(required = false) UUID doctorId,
            @RequestParam(required = false) String search,
            Pageable pageable) {
        Page<MedicalRecordDto> page = medicalRecordService.getAllMedicalRecords(patientId, doctorId, search, pageable);

        PageResponse<MedicalRecordDto> pageResponse = PageResponse.<MedicalRecordDto>builder()
                .content(page.getContent())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();

        return ResponseEntity.ok(
                ApiResponse.<PageResponse<MedicalRecordDto>>builder()
                        .success(true)
                        .message("Medical records retrieved successfully")
                        .data(pageResponse)
                        .build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MedicalRecordDto>> getMedicalRecordById(@PathVariable UUID id) {
        MedicalRecordDto medicalRecord = medicalRecordService.getMedicalRecordById(id);
        return ResponseEntity.ok(
                ApiResponse.<MedicalRecordDto>builder()
                        .success(true)
                        .message("Medical record retrieved successfully")
                        .data(medicalRecord)
                        .build()
        );
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse<List<MedicalRecordDto>>> getMedicalRecordsByPatientId(@PathVariable UUID patientId) {
        List<MedicalRecordDto> medicalRecords = medicalRecordService.getMedicalRecordsByPatientId(patientId);
        return ResponseEntity.ok(
                ApiResponse.<List<MedicalRecordDto>>builder()
                        .success(true)
                        .message("Medical records for patient retrieved successfully")
                        .data(medicalRecords)
                        .build()
        );
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<ApiResponse<List<MedicalRecordDto>>> getMedicalRecordsByDoctorId(@PathVariable UUID doctorId) {
        List<MedicalRecordDto> medicalRecords = medicalRecordService.getMedicalRecordsByDoctorId(doctorId);
        return ResponseEntity.ok(
                ApiResponse.<List<MedicalRecordDto>>builder()
                        .success(true)
                        .message("Medical records for doctor retrieved successfully")
                        .data(medicalRecords)
                        .build()
        );
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<MedicalRecordDto>> updateMedicalRecord(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateMedicalRecordRequest request) {
        MedicalRecordDto medicalRecord = medicalRecordService.updateMedicalRecord(id, request);
        return ResponseEntity.ok(
                ApiResponse.<MedicalRecordDto>builder()
                        .success(true)
                        .message("Medical record updated successfully")
                        .data(medicalRecord)
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMedicalRecord(@PathVariable UUID id) {
        medicalRecordService.deleteMedicalRecord(id);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Medical record deleted successfully")
                        .data(null)
                        .build()
        );
    }

    @GetMapping("/meta")
    public ResponseEntity<ApiResponse<MedicalRecordMetadataDto>> getMedicalRecordMetadata() {
        MedicalRecordMetadataDto metadata = medicalRecordService.getMedicalRecordMetadata();
        return ResponseEntity.ok(
                ApiResponse.<MedicalRecordMetadataDto>builder()
                        .success(true)
                        .message("Medical record metadata retrieved successfully")
                        .data(metadata)
                        .build()
        );
    }
}
