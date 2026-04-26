package com.ecocycle.backend.auth;

import com.ecocycle.backend.auth.dto.request.LoginRequest;
import com.ecocycle.backend.auth.dto.request.SignupRequest;
import com.ecocycle.backend.user.model.User;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.userdetails.UserDetails;

public interface AuthService {
    User createUser(SignupRequest request);
    UserDetails authenticate(LoginRequest request, HttpServletResponse response);
    String refreshToken(String token);
    void logout(User user, HttpServletResponse response);
}
