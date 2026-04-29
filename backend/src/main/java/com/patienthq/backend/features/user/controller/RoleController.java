package com.patienthq.backend.features.user.controller;

import com.patienthq.backend.features.user.dto.RoleDto;
import com.patienthq.backend.features.user.dto.request.CreateRoleRequest;
import com.patienthq.backend.features.user.dto.request.UpdateRoleRequest;
import com.patienthq.backend.features.user.mapper.RoleMapper;
import com.patienthq.backend.features.user.model.Role;
import com.patienthq.backend.features.user.service.RoleService;
import com.patienthq.backend.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;
    private final RoleMapper roleMapper;

    @GetMapping
    public ResponseEntity<ApiResponse<List<RoleDto>>> getRoles() {
        List<Role> roles = roleService.getAllRoles();
        List<RoleDto> roleDtos = roles.stream().map(roleMapper::toDto).toList();
        return ResponseEntity.ok(ApiResponse.success("Roles retrieved successfully.", roleDtos));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RoleDto>> createRole(
            @RequestBody CreateRoleRequest request
    ) {
        Role createdRole = roleService.createRole(request);
        RoleDto roleDto = roleMapper.toDto(createdRole);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Role created successfully.", roleDto));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<RoleDto>> updateRole(
            @PathVariable Integer id,
            @RequestBody UpdateRoleRequest request
    ) {
        Role updatedRole = roleService.updateRole(id, request);
        RoleDto roleDto = roleMapper.toDto(updatedRole);
        return ResponseEntity.ok(ApiResponse.success("Roles retrieved successfully.", roleDto));
    }

}
