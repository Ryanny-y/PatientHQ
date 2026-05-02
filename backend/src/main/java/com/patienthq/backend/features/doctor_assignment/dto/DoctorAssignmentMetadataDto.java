package com.patienthq.backend.features.doctor_assignment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorAssignmentMetadataDto {

    private Long activeAssignments;

    private Long unassignedPatients;

    private Long availableDoctors;

    private Long highWorkloadDoctors;
}
