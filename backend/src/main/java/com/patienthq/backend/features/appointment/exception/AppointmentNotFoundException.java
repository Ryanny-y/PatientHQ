package com.patienthq.backend.features.appointment.exception;

import com.patienthq.backend.shared.exceptions.AppException;
import org.springframework.http.HttpStatus;

import java.util.UUID;

public class AppointmentNotFoundException extends AppException {

    public AppointmentNotFoundException(UUID id) {
        super(HttpStatus.NOT_FOUND, "Appointment not found with id: " + id);
    }
}
