package com.patienthq.backend.features.user;

import com.patienthq.backend.features.user.dto.request.UpdateUserRequest;
import com.patienthq.backend.features.user.model.User;

import java.util.List;

public interface UserService {
    List<User> getUsers();
    User getUserById(Integer userId);
    User updateUser(Integer userId, UpdateUserRequest request);
    void deleteUser(Integer userId);
    User getUserByUsername(String username);
}
