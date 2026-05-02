package com.patienthq.backend.features.report.exception;

import com.patienthq.backend.shared.exceptions.AppException;
import org.springframework.http.HttpStatus;

import java.util.UUID;

public class ReportNotFoundException extends AppException {

    public ReportNotFoundException(UUID id) {
        super(HttpStatus.NOT_FOUND, "Report not found with id: " + id);
    }
}
