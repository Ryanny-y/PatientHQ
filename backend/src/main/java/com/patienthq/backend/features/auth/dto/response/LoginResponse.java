    package com.patienthq.backend.features.auth.dto.response;

    import lombok.AllArgsConstructor;
    import lombok.Builder;
    import lombok.Data;
    import lombok.NoArgsConstructor;

    import java.util.Set;
    import java.util.UUID;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public class LoginResponse {
        private UUID id;
        private String accessToken;
        private String username;
        private String role;
        private Set<String> permissions;
    }
