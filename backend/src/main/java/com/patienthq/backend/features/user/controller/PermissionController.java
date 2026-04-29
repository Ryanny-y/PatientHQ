package com.patienthq.backend.features.user.controller;

import com.patienthq.backend.features.user.dto.PermissionDto;
import com.patienthq.backend.features.user.dto.request.CreatePermissionRequest;
import com.patienthq.backend.features.user.dto.request.UpdatePermissionRequest;
import com.patienthq.backend.features.user.mapper.PermissionMapper;
import com.patienthq.backend.features.user.model.Permission;
import com.patienthq.backend.features.user.service.PermissionService;
import com.patienthq.backend.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/permissions")
@RequiredArgsConstructor
public class PermissionController {

    private final PermissionService permissionService;
    private final PermissionMapper permissionMapper;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PermissionDto>>> getPermissions() {
        List<Permission> permissions = permissionService.getAllPermission();
        List<PermissionDto> permissionDtos = permissions.stream().map(permissionMapper::toDto).toList();
        return ResponseEntity.ok(ApiResponse.success("Permissions retrieved successfully.", permissionDtos));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PermissionDto>> createPermission(
            @RequestBody CreatePermissionRequest request
    ) {
        Permission createdPermission = permissionService.createPermission(request);
        PermissionDto permissionDto = permissionMapper.toDto(createdPermission);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Permission created successfully.", permissionDto));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<PermissionDto>> updatePermission(
            @PathVariable Integer id,
            @RequestBody UpdatePermissionRequest request
    ) {
        Permission updatedPermission = permissionService.updatePermission(id, request);
        PermissionDto permissionDto = permissionMapper.toDto(updatedPermission);
        return ResponseEntity.ok(ApiResponse.success("Permissions updated successfully.", permissionDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePermission(
        @PathVariable Integer id
    ) {
        permissionService.deletePermission(id);
        return ResponseEntity.ok(ApiResponse.success("Permissions deleted successfully.", null));

    }
}
