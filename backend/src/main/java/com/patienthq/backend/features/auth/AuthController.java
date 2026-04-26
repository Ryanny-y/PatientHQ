package com.ecocycle.backend.auth;

import com.ecocycle.backend.auth.dto.request.SignupRequest;
import com.ecocycle.backend.auth.dto.response.RefreshResponse;
import com.ecocycle.backend.auth.dto.response.SignupResponse;
import com.ecocycle.backend.common.web.ApiResponse;
import com.ecocycle.backend.auth.dto.response.LoginResponse;
import com.ecocycle.backend.auth.dto.request.LoginRequest;
import com.ecocycle.backend.security.UserPrincipal;
import com.ecocycle.backend.security.jwt.JwtService;
import com.ecocycle.backend.security.ratelimit.RateLimit;
import com.ecocycle.backend.user.UserService;
import com.ecocycle.backend.user.model.User;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final UserService userService;

    @RateLimit(limit = 5, duration = 1)
    @PostMapping("/sign-up")
    public ResponseEntity<ApiResponse<SignupResponse>> signup(
            @Valid @RequestBody SignupRequest signupRequest
    ) {
        User createdUser = authService.createUser(signupRequest);

        SignupResponse signupResponse = new SignupResponse(
                createdUser.getId(),
                createdUser.getUsername(),
                createdUser.getEmail()
        );

        ApiResponse<SignupResponse> apiResponse = ApiResponse.<SignupResponse>builder()
                .success(true)
                .message("Signup Successful.")
                .data(signupResponse)
                .build();

        return new ResponseEntity<>(apiResponse, HttpStatus.CREATED);
    }

    @RateLimit(limit = 5, duration = 1)
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login (
            @Valid @RequestBody LoginRequest loginRequest,
            HttpServletResponse httpResponse
    ) {
        UserDetails userDetails = authService.authenticate(loginRequest, httpResponse);
        String accessToken = jwtService.generateAccessToken(userDetails);
        User user = userService.getUserByUsername(loginRequest.getUsername());

        LoginResponse loginResponse = new LoginResponse(
                accessToken,
                user.getUsername(),
                user.getRole()
        );

        ApiResponse<LoginResponse> apiResponse = ApiResponse.<LoginResponse>builder()
                .success(true)
                .message("Login Successful.")
                .data(loginResponse)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @RateLimit(limit = 10, duration = 15)
    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<RefreshResponse>> refreshToken(
            @CookieValue(name = "refreshToken", required = false) String token
    ) {
        String accessToken = authService.refreshToken(token);
        String username = jwtService.extractUsername(token);
        User user = userService.getUserByUsername(username);

        RefreshResponse refreshResponse = new RefreshResponse(
                accessToken,
                user.getUsername(),
                user.getRole()
        );

        ApiResponse<RefreshResponse> apiResponse = ApiResponse.<RefreshResponse>builder()
                .success(true)
                .message("Refresh Token Successful.")
                .data(refreshResponse)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @RateLimit(limit = 10, duration = 1)
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
