package com.patienthq.backend.features.admin.exceptions;

import com.patienthq.backend.shared.exceptions.AppException;
import org.springframework.http.HttpStatus;

public class AdminNotFoundException extends AppException {
    public AdminNotFoundException(String message) {
        super(HttpStatus.NOT_FOUND, message);
    }
}
