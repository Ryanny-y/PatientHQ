package com.patienthq.backend.features.auth.dto.response;

import com.patienthq.backend.features.user.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RefreshResponse {
    private String accessToken;
    private String username;
    private Role role;
}
