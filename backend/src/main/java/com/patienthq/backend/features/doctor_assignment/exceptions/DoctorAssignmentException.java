package com.patienthq.backend.features.doctor_assignment.exceptions;

import com.patienthq.backend.shared.exceptions.AppException;
import org.springframework.http.HttpStatus;

import java.util.UUID;

public class DoctorAssignmentException {

    public static class PatientAlreadyAssignedException extends AppException {
        public PatientAlreadyAssignedException(String patientName) {
            super(HttpStatus.CONFLICT, "Patient '" + patientName + "' is already assigned to a doctor");
        }
    }

    public static class AssignmentNotFoundException extends AppException {
        public AssignmentNotFoundException(UUID assignmentId) {
            super(HttpStatus.NOT_FOUND, "Doctor assignment with ID '" + assignmentId + "' not found");
        }
    }

    public static class DoctorNotFoundException extends AppException {
        public DoctorNotFoundException(UUID doctorId) {
            super(HttpStatus.NOT_FOUND, "Doctor with ID '" + doctorId + "' not found");
        }
    }

    public static class PatientNotFoundException extends AppException {
        public PatientNotFoundException(UUID patientId) {
            super(HttpStatus.NOT_FOUND, "Patient with ID '" + patientId + "' not found");
        }
    }

    public static class DoctorNotActiveException extends AppException {
        public DoctorNotActiveException(String doctorName) {
            super(HttpStatus.BAD_REQUEST, "Doctor '" + doctorName + "' is not active");
        }
    }

    public static class PatientNotActiveException extends AppException {
        public PatientNotActiveException(String patientName) {
            super(HttpStatus.BAD_REQUEST, "Patient '" + patientName + "' is not active");
        }
    }
}