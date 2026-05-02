package com.patienthq.backend.features.auth.dto.response;

import com.patienthq.backend.features.user.model.Role;
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
public class RefreshResponse {
    private UUID id;
    private String accessToken;
    private String username;
    private Role role;
    private Set<String> permissions;
}
