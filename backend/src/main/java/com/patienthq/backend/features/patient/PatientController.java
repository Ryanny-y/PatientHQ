package com.patienthq.backend.features.patient;

import com.patienthq.backend.features.nurse.dto.NurseDto;
import com.patienthq.backend.features.nurse.model.Nurse;
import com.patienthq.backend.features.patient.dto.PatientDto;
import com.patienthq.backend.features.patient.dto.request.CreatePatientRequest;
import com.patienthq.backend.features.patient.dto.request.UpdatePatientRequest;
import com.patienthq.backend.features.patient.model.Patient;
import com.patienthq.backend.features.patient.service.PatientService;
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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;
    private final PatientMapper patientMapper;

    @PostMapping
    public ResponseEntity<ApiResponse<PatientDto>> createPatient(
            @Valid @RequestBody CreatePatientRequest request
    ) {
        Patient patient = patientService.createPatient(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<PatientDto>builder()
                        .success(true)
                        .message("Patient created successfully")
                        .data(patientMapper.toDto(patient))
                        .build()
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<PatientDto>>> getAllPatients(
            Pageable pageable
    ) {
        Page<Patient> patients = patientService.getAllPatients(pageable);

        List<PatientDto> patientsDto = patients.map(patientMapper::toDto).stream().toList();
        PageResponse<PatientDto> pageResponse = PageResponse.<PatientDto>builder()
                .content(patientsDto)
                .page(patients.getNumber())
                .size(patients.getSize())
                .totalElements(patients.getTotalElements())
                .totalPages(patients.getTotalPages())
                .first(patients.isFirst())
                .last(patients.isLast())
                .build();

        return ResponseEntity.ok(
                ApiResponse.<PageResponse<PatientDto>>builder()
                        .success(true)
                        .message("Patients retrieved successfully")
                        .data(pageResponse)
                        .build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PatientDto>> getPatientById(@PathVariable UUID id) {
        Patient patient = patientService.getPatientById(id);

        return ResponseEntity.ok(
                ApiResponse.<PatientDto>builder()
                        .success(true)
                        .message("Patient retrieved successfully")
                        .data(patientMapper.toDto(patient))
                        .build()
        );
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<PatientDto>> updatePatient(
            @PathVariable UUID id,
            @Valid @RequestBody UpdatePatientRequest request
    ) {
        Patient patient = patientService.updatePatient(id, request);

        return ResponseEntity.ok(
                ApiResponse.<PatientDto>builder()
                        .success(true)
                        .message("Patient updated successfully")
                        .data(patientMapper.toDto(patient))
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePatient(@PathVariable UUID id) {
        patientService.deletePatient(id);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Patient deleted successfully")
                        .data(null)
                        .build()
        );
    }
}