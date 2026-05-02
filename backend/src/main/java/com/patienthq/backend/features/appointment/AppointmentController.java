package com.patienthq.backend.features.appointment;

import com.patienthq.backend.features.appointment.dto.AppointmentDto;
import com.patienthq.backend.features.appointment.dto.request.CreateAppointmentRequest;
import com.patienthq.backend.features.appointment.dto.request.UpdateAppointmentRequest;
import com.patienthq.backend.features.appointment.model.AppointmentStatus;
import com.patienthq.backend.features.appointment.service.AppointmentService;
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
@RequestMapping("/api/v1/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<ApiResponse<AppointmentDto>> createAppointment(
            @Valid @RequestBody CreateAppointmentRequest request) {
        AppointmentDto appointment = appointmentService.createAppointment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<AppointmentDto>builder()
                        .success(true)
                        .message("Appointment created successfully")
                        .data(appointment)
                        .build()
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<AppointmentDto>>> getAllAppointments(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) UUID patientId,
            @RequestParam(required = false) UUID doctorId,
            Pageable pageable) {
        AppointmentStatus appointmentStatus = (status == null) ? null : AppointmentStatus.valueOf(status.toUpperCase());
        Page<AppointmentDto> page = appointmentService.getAllAppointments(search, appointmentStatus, patientId, doctorId, pageable);
        PageResponse<AppointmentDto> pageResponse = PageResponse.<AppointmentDto>builder()
                .content(page.getContent())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
        return ResponseEntity.ok(
                ApiResponse.<PageResponse<AppointmentDto>>builder()
                        .success(true)
                        .message("Appointments retrieved successfully")
                        .data(pageResponse)
                        .build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AppointmentDto>> getAppointmentById(@PathVariable UUID id) {
        AppointmentDto appointment = appointmentService.getAppointmentById(id);
        return ResponseEntity.ok(
                ApiResponse.<AppointmentDto>builder()
                        .success(true)
                        .message("Appointment retrieved successfully")
                        .data(appointment)
                        .build()
        );
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<AppointmentDto>> updateAppointment(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateAppointmentRequest request) {
        AppointmentDto appointment = appointmentService.updateAppointment(id, request);
        return ResponseEntity.ok(
                ApiResponse.<AppointmentDto>builder()
                        .success(true)
                        .message("Appointment updated successfully")
                        .data(appointment)
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAppointment(@PathVariable UUID id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Appointment deleted successfully")
                        .data(null)
                        .build()
        );
    }
}
