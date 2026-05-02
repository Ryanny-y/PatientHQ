package com.patienthq.backend.features.appointment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentMetadataDto {

    private long totalAppointments;
    private long todaysAppointments;
    private long pendingAppointments;
    private long completedThisWeek;
}
