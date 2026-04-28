package com.patienthq.backend.features.doctor;

import com.patienthq.backend.features.admin.dto.AdminDto;
import com.patienthq.backend.features.doctor.dto.DoctorDto;
import com.patienthq.backend.features.doctor.dto.request.CreateDoctorRequest;
import com.patienthq.backend.features.doctor.dto.request.UpdateDoctorRequest;
import com.patienthq.backend.features.doctor.model.Doctor;
import com.patienthq.backend.features.doctor.service.DoctorService;
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
@RequestMapping("/api/v1/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;
    private final DoctorMapper doctorMapper;

    @PostMapping
    public ResponseEntity<ApiResponse<DoctorDto>> createDoctor(@Valid @RequestBody CreateDoctorRequest request) {
        Doctor doctor = doctorService.createDoctor(request);
        DoctorDto doctorDto = doctorMapper.toDto(doctor);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<DoctorDto>builder()
                        .success(true)
                        .message("Doctor created successfully")
                        .data(doctorDto)
                        .build()
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<DoctorDto>>> getAllDoctors(
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) String search,
            Pageable pageable
    ) {
        Page<Doctor> doctors = doctorService.getAllDoctors(isActive, search, pageable);

        List<DoctorDto> doctorDto = doctors.map(doctorMapper::toDto).stream().toList();
        PageResponse<DoctorDto> pageResponse = PageResponse.<DoctorDto>builder()
                .content(doctorDto)
                .page(doctors.getNumber())
                .size(doctors.getSize())
                .totalElements(doctors.getTotalElements())
                .totalPages(doctors.getTotalPages())
                .first(doctors.isFirst())
                .last(doctors.isLast())
                .build();

        return ResponseEntity.ok(
                ApiResponse.<PageResponse<DoctorDto>>builder()
                        .success(true)
                        .message("Doctors retrieved successfully")
                        .data(pageResponse)
                        .build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DoctorDto>> getDoctorById(@PathVariable UUID id) {
        Doctor doctor = doctorService.getDoctorById(id);
        return ResponseEntity.ok(
                ApiResponse.<DoctorDto>builder()
                        .success(true)
                        .message("Doctor retrieved successfully")
                        .data(doctorMapper.toDto(doctor))
                        .build()
        );
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<DoctorDto>> updateDoctor(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateDoctorRequest request) {
        Doctor doctor = doctorService.updateDoctor(id, request);
        return ResponseEntity.ok(
                ApiResponse.<DoctorDto>builder()
                        .success(true)
                        .message("Doctor updated successfully")
                        .data(doctorMapper.toDto(doctor))
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDoctor(@PathVariable UUID id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Doctor deleted successfully")
                        .data(null)
                        .build()
        );
    }
}