    package com.patienthq.backend.features.auth.dto.response;

    import lombok.AllArgsConstructor;
    import lombok.Builder;
    import lombok.Data;
    import lombok.NoArgsConstructor;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public class LoginResponse {
        private String accessToken;
        private String username;
        private String role;
    }
