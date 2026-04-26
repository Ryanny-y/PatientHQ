package com.patienthq.backend.features.auth.service;

import com.patienthq.backend.features.auth.dto.request.LoginRequest;
import com.patienthq.backend.features.user.model.User;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.userdetails.UserDetails;

public interface AuthService {
    UserDetails authenticate(LoginRequest request, HttpServletResponse response);
    String refreshToken(String token);
    void logout(User user, HttpServletResponse response);
}
