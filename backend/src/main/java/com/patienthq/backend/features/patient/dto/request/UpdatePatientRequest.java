package com.patienthq.backend.features.patient.dto.request;

import com.patienthq.backend.features.patient.model.PatientStatus;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdatePatientRequest {

    @NotBlank(message = "Full name cannot be blank")
    @Size(max = 100)
    private String fullName;

    private LocalDate dateOfBirth;

    @Size(max = 20)
    private String gender;

    @Size(max = 20)
    @Pattern(
            regexp = "^[0-9+\\-()\\s]*$",
            message = "Contact number contains invalid characters"
    )
    private String contactNumber;

    @Email(message = "Invalid email format")
    @Size(max = 100)
    private String email;

    private String address;

    @Size(max = 10)
    private String bloodType;

    private String allergies;

    @Size(max = 100)
    private String emergencyContactName;

    @Size(max = 20)
    @Pattern(
            regexp = "^[0-9+\\-()\\s]*$",
            message = "Emergency contact number contains invalid characters"
    )
    private String emergencyContactNumber;

    @Size(max = 50)
    private PatientStatus status;
}