    package com.ecocycle.backend.auth.dto.response;

    import com.ecocycle.backend.user.model.UserRole;
    import lombok.AllArgsConstructor;
    import lombok.Builder;
    import lombok.Data;
    import lombok.NoArgsConstructor;

    import java.util.Set;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public class LoginResponse {
        private String accessToken;
        private String username;
        UserRole role;
    }
