package com.patienthq.backend.features.auth;

import com.patienthq.backend.features.auth.dto.request.LoginRequest;
import com.patienthq.backend.features.auth.dto.request.SignupRequest;
import com.patienthq.backend.features.auth.exceptions.InvalidCredentialsException;
import com.patienthq.backend.features.user.model.User;
import com.patienthq.backend.features.user.repository.UserRepository;
import com.patienthq.backend.shared.security.UserPrincipal;
import com.patienthq.backend.shared.security.jwt.JwtService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.rememberme.InvalidCookieException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Transactional
    @Override
    public UserDetails authenticate(LoginRequest request, HttpServletResponse response) {
        User user = userRepository.findByUsernameWithRole(request.getUsername())
                .orElseThrow(() -> new InvalidCredentialsException("Username or Password is incorrect."));

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );

            UserDetails userDetails = new UserPrincipal(user);
            String refreshToken = jwtService.generateRefreshToken(userDetails);
            LocalDateTime refreshTokenExp = jwtService.getRefreshTokenExp(refreshToken);

            user.setRefreshToken(refreshToken);
            user.setRefreshTokenExp(refreshTokenExp);
            userRepository.save(user);
            setRefreshTokenToCookie(response, refreshToken, refreshTokenExp);

            return userDetails;
        } catch (AuthenticationException ex) {
            throw new InvalidCredentialsException("Username or Password is incorrect.");
        }
    }

    @Override
    public String refreshToken(String token) {
        if(token == null || token.isBlank()) {
            throw new InvalidCookieException("Refresh Token is Missing.");
        }

        if(!jwtService.isTokenValid(token)) {
            throw new InvalidCookieException("Refresh token is expired or invalid.");
        }

        String username = jwtService.extractUsername(token);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        return jwtService.generateAccessToken(userDetails);
    }

    @Override
    public void logout(User user, HttpServletResponse response) {
        if(user != null) {
            user.setRefreshToken(null);
            user.setRefreshTokenExp(null);
            userRepository.save(user);
        }

        clearRefreshTokenToCookie(response);
        SecurityContextHolder.clearContext();
    }

    private void setRefreshTokenToCookie(
            HttpServletResponse response,
            String refreshToken,
            LocalDateTime refreshTokenExp
    ) {
        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/api/v1/auth")
                .sameSite("None")
                .maxAge(Duration.between(LocalDateTime.now(), refreshTokenExp))
                .build();
        response.addHeader("Set-Cookie", cookie.toString());
        log.info("Refresh Token Cookie Set Successfully!");
    }

    private void clearRefreshTokenToCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(true)
                .path("/api/v1/auth")
                .maxAge(0)
                .sameSite("None")
                .build();

        response.addHeader("Set-Cookie", cookie.toString());
        log.info("Refresh Token Cookie Cleared Successfully!");
    }
}
