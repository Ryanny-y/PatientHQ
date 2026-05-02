package com.patienthq.backend.features.user.service;

import com.patienthq.backend.features.user.dto.request.UpdateUserRequest;
import com.patienthq.backend.features.user.model.User;

import java.util.List;
import java.util.UUID;

public interface UserService {
    List<User> getUsers();
    User getUserById(UUID userId);
    User updateUser(UUID userId, UpdateUserRequest request);
    void deleteUser(UUID userId);
    User getUserByUsername(String username);
}
