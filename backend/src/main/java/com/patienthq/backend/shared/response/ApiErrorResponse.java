package com.patienthq.backend.shared.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApiErrorResponse {
    private boolean success;
    private String message;
    private int status;
    private String code;
    private LocalDateTime timestamp;

    public static ApiErrorResponse of(
            HttpStatus status,
            String message,
            String code
    ) {
        return ApiErrorResponse.builder()
                .success(false)
                .message(message)
                .status(status.value())
                .code(code)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
