package com.patienthq.backend.features.auth;

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

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login (
            @Valid @RequestBody LoginRequest loginRequest,
            HttpServletResponse httpResponse
    ) {
        UserDetails userDetails = authService.authenticate(loginRequest, httpResponse);
        String accessToken = jwtService.generateAccessToken(userDetails);
        User user = userService.getUserByUsername(loginRequest.getUsername());
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
            HttpServletResponse response
    ) {
        User user = userPrincipal != null ? userPrincipal.getUser() : null;

        authService.logout(user, response);
        return ResponseEntity.noContent().build();
    }


}
