package com.patienthq.backend.features.user.service;

import com.patienthq.backend.features.user.mapper.UserMapper;
import com.patienthq.backend.features.user.dto.request.UpdateUserRequest;
import com.patienthq.backend.features.user.exceptions.UserNotFoundException;
import com.patienthq.backend.features.user.model.Role;
import com.patienthq.backend.features.user.model.User;
import com.patienthq.backend.features.user.repository.RoleRepository;
import com.patienthq.backend.features.user.repository.UserRepository;
import com.patienthq.backend.shared.exceptions.AppException;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<User> getUsers() {
        return userRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    @Override
    public User getUserById(UUID userId) {
        return findUserById(userId);
    }

    @Override
    public User updateUser(UUID userId, UpdateUserRequest request) {
        User user = findUserById(userId);

        Role role = roleRepository.findByRoleName(request.getRoleName())
                .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST, "Role not found: " + request.getRoleName()));

        user.setUsername(request.getUsername());
        user.setRole(role);

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            if (request.getConfirmPassword() == null || request.getConfirmPassword().isBlank())
                throw new AppException(HttpStatus.BAD_REQUEST, "Confirm password is required");
            if (!request.getPassword().equals(request.getConfirmPassword()))
                throw new AppException(HttpStatus.BAD_REQUEST, "Passwords do not match");
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return userRepository.save(user);
    }

    @Override
    public void deleteUser(UUID userId) {
        userRepository.delete(findUserById(userId));
    }

    @Override
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found with username: " + username));
    }

    private User findUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + id));
    }
}
