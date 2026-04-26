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
public class CreatePatientRequest {

    @NotBlank(message = "Full name is required")
    @Size(max = 100, message = "Full name must not exceed 100 characters")
    private String fullName;

    private LocalDate dateOfBirth;

    @Size(max = 20, message = "Gender must not exceed 20 characters")
    private String gender;

    @Size(max = 20, message = "Contact number must not exceed 20 characters")
    @Pattern(
            regexp = "^[0-9+\\-()\\s]*$",
            message = "Contact number contains invalid characters"
    )
    private String contactNumber;

    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String email;

    private String address;

    @Size(max = 10, message = "Blood type must not exceed 10 characters")
    private String bloodType;

    private String allergies;

    @Size(max = 100, message = "Emergency contact name must not exceed 100 characters")
    private String emergencyContactName;

    @Size(max = 20, message = "Emergency contact number must not exceed 20 characters")
    @Pattern(
            regexp = "^[0-9+\\-()\\s]*$",
            message = "Emergency contact number contains invalid characters"
    )
    private String emergencyContactNumber;

    @NotNull(message = "Patient Status is required.")
    private PatientStatus status;

}