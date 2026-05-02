package com.patienthq.backend.features.appointment.dto.request;

import com.patienthq.backend.features.appointment.model.AppointmentStatus;
import jakarta.validation.constraints.Future;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAppointmentRequest {

    @Future(message = "Appointment date must be in the future")
    private LocalDateTime appointmentDate;

    private String reason;

    private AppointmentStatus status;

    private String notes;
}
