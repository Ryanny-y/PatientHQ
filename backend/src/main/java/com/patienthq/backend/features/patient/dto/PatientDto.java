package com.patienthq.backend.features.patient.dto;

import com.patienthq.backend.features.patient.model.PatientStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientDto {

    private UUID patientId;

    private String fullName;
    private LocalDate dateOfBirth;
    private String gender;

    private String contactNumber;
    private String email;
    private String address;

    private String bloodType;
    private String allergies;

    private String emergencyContactName;
    private String emergencyContactNumber;

    private String assignedDoctor;

    private PatientStatus status;
    private LocalDateTime createdAt;
}