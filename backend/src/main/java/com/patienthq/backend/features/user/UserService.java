package com.patienthq.backend.features.user;

import com.patienthq.backend.features.user.dto.UserDto;
import com.patienthq.backend.features.user.dto.request.UpdateUserRequest;

import java.util.List;

public interface UserService {
    List<UserDto> getUsers();
    UserDto getUserById(Integer userId);
    UserDto updateUser(Integer userId, UpdateUserRequest request);
    void deleteUser(Integer userId);
}
