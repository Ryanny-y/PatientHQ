package com.patienthq.backend.features.user.controller;

import com.patienthq.backend.features.user.mapper.UserMapper;
import com.patienthq.backend.features.user.dto.UserDto;
import com.patienthq.backend.features.user.dto.request.UpdateUserRequest;
import com.patienthq.backend.features.user.model.User;
import com.patienthq.backend.features.user.service.UserService;
import com.patienthq.backend.shared.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserDto>>> getUsers() {
        List<User> users = userService.getUsers();
        List<UserDto> userDtos = users.stream().map(userMapper::toDto).toList();
        return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", userDtos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDto>> getUserById(@PathVariable UUID id) {
        User user = userService.getUserById(id);
        UserDto userDto = userMapper.toDto(user);
        return ResponseEntity.ok(ApiResponse.success("User retrieved successfully", userDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDto>> updateUser(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateUserRequest request) {
        User user = userService.updateUser(id, request);
        UserDto userDto = userMapper.toDto(user);
        return ResponseEntity.ok(ApiResponse.success("User updated successfully", userDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
    }
}
