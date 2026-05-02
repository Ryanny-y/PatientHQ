package com.patienthq.backend.features.doctor_assignment.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReassignDoctorRequest {

    @NotNull(message = "Assignment ID is required")
    private UUID assignmentId;

    @NotNull(message = "New Doctor ID is required")
    private UUID newDoctorId;
}