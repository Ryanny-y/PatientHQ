package com.patienthq.backend.features.doctor_assignment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorAssignmentDto {

    private UUID assignmentId;
    private UUID patientId;
    private String patientName;
    private UUID doctorId;
    private String doctorName;
    private String doctorSpecialization;
    private LocalDateTime assignedDate;
    private Boolean isActive;
}