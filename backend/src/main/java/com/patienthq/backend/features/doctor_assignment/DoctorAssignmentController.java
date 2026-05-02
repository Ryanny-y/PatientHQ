package com.patienthq.backend.features.doctor_assignment;

import com.patienthq.backend.features.doctor_assignment.dto.DoctorAssignmentDto;
import com.patienthq.backend.features.doctor_assignment.dto.DoctorAssignmentMetadataDto;
import com.patienthq.backend.features.doctor_assignment.dto.request.AssignDoctorRequest;
import com.patienthq.backend.features.doctor_assignment.dto.request.ReassignDoctorRequest;
import com.patienthq.backend.features.doctor_assignment.model.DoctorAssignment;
import com.patienthq.backend.features.doctor_assignment.service.DoctorAssignmentService;
import com.patienthq.backend.features.patient.model.PatientStatus;
import com.patienthq.backend.shared.response.ApiResponse;
import com.patienthq.backend.shared.response.PageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/doctor-assignments")
@RequiredArgsConstructor
public class DoctorAssignmentController {

    private final DoctorAssignmentService doctorAssignmentService;
    private final DoctorAssignmentMapper doctorAssignmentMapper;

    @PostMapping("/assign")
    public ResponseEntity<ApiResponse<DoctorAssignmentDto>> assignDoctorToPatient(
            @Valid @RequestBody AssignDoctorRequest request
    ) {
        DoctorAssignmentDto assignment = doctorAssignmentService.assignDoctorToPatient(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<DoctorAssignmentDto>builder()
                        .success(true)
                        .message("Doctor assigned to patient successfully")
                        .data(assignment)
                        .build()
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<DoctorAssignmentDto>>> getAllDoctorAssignments(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) PatientStatus patientStatus,
            Pageable pageable
    ) {
        Page<DoctorAssignment> assignments = doctorAssignmentService.getAllDoctorAssignments(search, isActive, patientStatus, pageable);
        Page<DoctorAssignmentDto> assignmentDtos = assignments.map(doctorAssignmentMapper::toDto);

        PageResponse<DoctorAssignmentDto> pageResponse = PageResponse.<DoctorAssignmentDto>builder()
                .content(assignmentDtos.getContent())
                .page(assignments.getNumber())
                .size(assignments.getSize())
                .totalElements(assignments.getTotalElements())
                .totalPages(assignments.getTotalPages())
                .first(assignments.isFirst())
                .last(assignments.isLast())
                .build();

        return ResponseEntity.ok(
                ApiResponse.<PageResponse<DoctorAssignmentDto>>builder()
                        .success(true)
                        .message("Doctor assignments retrieved successfully")
                        .data(pageResponse)
                        .build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DoctorAssignmentDto>> getDoctorAssignmentById(@PathVariable UUID id) {
        DoctorAssignmentDto assignment = doctorAssignmentService.getDoctorAssignmentById(id);

        return ResponseEntity.ok(
                ApiResponse.<DoctorAssignmentDto>builder()
                        .success(true)
                        .message("Doctor assignment retrieved successfully")
                        .data(assignment)
                        .build()
        );
    }

    @PatchMapping("/reassign")
    public ResponseEntity<ApiResponse<DoctorAssignmentDto>> reassignDoctor(
            @Valid @RequestBody ReassignDoctorRequest request
    ) {
        DoctorAssignmentDto assignment = doctorAssignmentService.reassignDoctor(request);

        return ResponseEntity.ok(
                ApiResponse.<DoctorAssignmentDto>builder()
                        .success(true)
                        .message("Doctor reassigned successfully")
                        .data(assignment)
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDoctorAssignment(@PathVariable UUID id) {
        doctorAssignmentService.deleteDoctorAssignment(id);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Doctor assignment deleted successfully")
                        .data(null)
                        .build()
        );
    }

    @GetMapping("/meta")
    public ResponseEntity<ApiResponse<DoctorAssignmentMetadataDto>> getDoctorAssignmentMetadata() {
        DoctorAssignmentMetadataDto metadata = doctorAssignmentService.getDoctorAssignmentMetadata();

        return ResponseEntity.ok(
                ApiResponse.<DoctorAssignmentMetadataDto>builder()
                        .success(true)
                        .message("Doctor assignment metadata retrieved successfully")
                        .data(metadata)
                        .build()
        );
    }
}