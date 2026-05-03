package com.patienthq.backend.features.data_integrity.exception;

import com.patienthq.backend.shared.exceptions.AppException;
import org.springframework.http.HttpStatus;

import java.util.UUID;

public class DataIntegrityNotFoundException extends AppException {

    public DataIntegrityNotFoundException(UUID patientId) {
        super(HttpStatus.NOT_FOUND, "Data integrity record not found for patient: " + patientId);
    }
}
