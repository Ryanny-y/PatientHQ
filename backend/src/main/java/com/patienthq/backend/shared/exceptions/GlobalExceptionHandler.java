package com.patienthq.backend.shared.exceptions;

import com.patienthq.backend.features.auth.exceptions.InvalidCredentialsException;
import com.patienthq.backend.features.user.exceptions.UserNotFoundException;
import com.patienthq.backend.shared.response.ApiErrorResponse;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.context.MessageSourceResolvable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.authentication.rememberme.InvalidCookieException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.HandlerMethodValidationException;

@ControllerAdvice
public class GlobalExceptionHandler {

    // -------- BAD REQUEST --------

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleMethodArgumentNotValidException(
            MethodArgumentNotValidException ex) {

        String combinedMessages = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .reduce((a, b) -> a + "; " + b)
                .orElse("Validation failed");

        return ResponseEntity.badRequest().body(
                ApiErrorResponse.of(
                        HttpStatus.BAD_REQUEST,
                        combinedMessages,
                        "VALIDATION_ERROR"
                )
        );
    }

    @ExceptionHandler(HandlerMethodValidationException.class)
    public ResponseEntity<ApiErrorResponse> handleHandlerMethodValidationException(
            HandlerMethodValidationException ex) {

        String combinedMessages = ex.getAllErrors()
                .stream()
                .map(MessageSourceResolvable::getDefaultMessage)
                .reduce((a, b) -> a + "; " + b)
                .orElse("Validation failed");

        return ResponseEntity.badRequest().body(
                ApiErrorResponse.of(
                        HttpStatus.BAD_REQUEST,
                        combinedMessages,
                        "VALIDATION_ERROR"
                )
        );
    }


    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorResponse> IllegalArgumentException(
            EntityNotFoundException ex) {

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                ApiErrorResponse.of(
                        HttpStatus.BAD_REQUEST,
                        ex.getMessage(),
                        "BAD_REQUEST"
                )
        );
    }

    // -------- NOT FOUND --------

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleEntityNotFoundException(
            EntityNotFoundException ex) {

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                ApiErrorResponse.of(
                        HttpStatus.NOT_FOUND,
                        ex.getMessage(),
                        "RESOURCE_NOT_FOUND"
                )
        );
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> UserNotFoundException(
            EntityNotFoundException ex) {

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                ApiErrorResponse.of(
                        HttpStatus.NOT_FOUND,
                        ex.getMessage(),
                        "USER_NOT_FOUND"
                )
        );
    }

    // -------- UNAUTHORIZED --------

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ApiErrorResponse> handleInvalidCredentialsException(
            InvalidCredentialsException ex) {

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                ApiErrorResponse.of(
                        HttpStatus.UNAUTHORIZED,
                        ex.getMessage(),
                        "INVALID_CREDENTIALS"
                )
        );
    }

    @ExceptionHandler(InvalidCookieException.class)
    public ResponseEntity<ApiErrorResponse> handleInvalidCookieException(
            InvalidCookieException ex) {

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                ApiErrorResponse.of(
                        HttpStatus.UNAUTHORIZED,
                        ex.getMessage(),
                        "EXPIRED_JWT"
                )
        );
    }

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<ApiErrorResponse> handleExpiredJwtException(
            ExpiredJwtException ex) {

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                ApiErrorResponse.of(
                        HttpStatus.UNAUTHORIZED,
                        "JWT token has expired",
                        "EXPIRED_JWT"
                )
        );
    }

    // -------- CONFLICT --------

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleDataIntegrityViolationException(
            DataIntegrityViolationException ex) {

        return ResponseEntity.status(HttpStatus.CONFLICT).body(
                ApiErrorResponse.of(
                        HttpStatus.CONFLICT,
                        "Request violates database constraints",
                        "DATA_INTEGRITY_VIOLATION"
                )
        );
    }

    // -------- TOO MANY REQUEST --------
//    @ExceptionHandler(RateLimitException.class)
//    public ResponseEntity<ApiErrorResponse> handleRateLimitExceptionException(
//            RateLimitException ex) {
//
//        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(
//                ApiErrorResponse.of(
//                        HttpStatus.TOO_MANY_REQUESTS,
//                        "Too Many Request, Please Try Again Later.",
//                        "TOO_MANY_REQUEST"
//                )
//        );
//    }

    // -------- INTERNAL SERVER ERROR --------

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleException(Exception ex) {

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ApiErrorResponse.of(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        ex.getMessage(),
                        "INTERNAL_SERVER_ERROR"
                )
        );
    }
}
