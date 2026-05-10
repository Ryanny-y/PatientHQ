package com.patienthq.backend.features.auth;

import com.patienthq.backend.features.audit_log.model.AuditLog;
import com.patienthq.backend.features.audit_log.repository.AuditLogRepository;
import com.patienthq.backend.features.auth.dto.request.LoginRequest;
import com.patienthq.backend.features.auth.dto.response.LoginResponse;
import com.patienthq.backend.features.auth.dto.response.RefreshResponse;
import com.patienthq.backend.features.auth.service.AuthService;
import com.patienthq.backend.features.user.model.Permission;
import com.patienthq.backend.features.user.service.UserService;
import com.patienthq.backend.features.user.model.User;
import com.patienthq.backend.shared.response.ApiResponse;
import com.patienthq.backend.shared.security.UserPrincipal;
import com.patienthq.backend.shared.security.jwt.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final UserService userService;
    private final AuditLogRepository auditLogRepository;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login (
            @Valid @RequestBody LoginRequest loginRequest,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse
    ) {
        UserDetails userDetails = authService.authenticate(loginRequest, httpResponse);
        String accessToken = jwtService.generateAccessToken(userDetails);
        User user = userService.getUserByUsername(loginRequest.getUsername());
        saveAuthAuditLog(user, "POST_AUTH_LOGIN_SUCCESS", "User logged in successfully", httpRequest);
        Set<String> permissions = user.getRole().getPermissions().stream().map(Permission::getPermissionName).collect(Collectors.toSet());

        LoginResponse loginResponse = new LoginResponse(
                user.getUserId(),
                accessToken,
                user.getUsername(),
                user.getRole().getRoleName(),
                permissions
        );

        ApiResponse<LoginResponse> apiResponse = ApiResponse.<LoginResponse>builder()
                .success(true)
                .message("Login Successful.")
                .data(loginResponse)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<RefreshResponse>> refreshToken(
            @CookieValue(name = "refreshToken", required = false) String token
    ) {
        String accessToken = authService.refreshToken(token);
        String username = jwtService.extractUsername(token);
        User user = userService.getUserByUsername(username);
        Set<String> permissions = user.getRole().getPermissions().stream().map(Permission::getPermissionName).collect(Collectors.toSet());

        RefreshResponse refreshResponse = new RefreshResponse(
                user.getUserId(),
                accessToken,
                user.getUsername(),
                user.getRole(),
                permissions
        );

        ApiResponse<RefreshResponse> apiResponse = ApiResponse.<RefreshResponse>builder()
                .success(true)
                .message("Refresh Token Successful.")
                .data(refreshResponse)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        User user = userPrincipal != null ? userPrincipal.getUser() : null;
        saveAuthAuditLog(user, "POST_AUTH_LOGOUT_SUCCESS", "User logged out successfully", request);

        authService.logout(user, response);
        return ResponseEntity.noContent().build();
    }

    private void saveAuthAuditLog(User user, String action, String description, HttpServletRequest request) {
        if (user == null) {
            return;
        }

        try {
            auditLogRepository.save(
                    AuditLog.builder()
                            .user(user)
                            .action(action)
                            .entityType("AUTH")
                            .description(description)
                            .ipAddress(resolveIpAddress(request))
                            .build()
            );
        } catch (RuntimeException ex) {
            log.warn("Failed to save auth audit log for user {}", user.getUsername(), ex);
        }
    }

    private String resolveIpAddress(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }

        return request.getRemoteAddr();
    }

}
