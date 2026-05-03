package com.patienthq.backend.features.user.service;

import com.patienthq.backend.features.user.dto.request.CreatePermissionRequest;
import com.patienthq.backend.features.user.dto.request.UpdatePermissionRequest;
import com.patienthq.backend.features.user.model.Permission;
import com.patienthq.backend.features.user.repository.PermissionRepository;
import com.patienthq.backend.shared.exceptions.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PermissionServiceImpl implements PermissionService {

    private final PermissionRepository permissionRepository;

    @Override
    public List<Permission> getAllPermission() {
        return permissionRepository.findAll();
    }

    @Override
    public Permission createPermission(CreatePermissionRequest request) {
        Permission permission = Permission.builder()
                .permissionName(request.getPermissionName())
                .description(request.getDescription())
                .build();

        return permissionRepository.save(permission);
    }

    @Override
    public Permission updatePermission(Integer id, UpdatePermissionRequest request) {
        Permission permission = getPermissionById(id);
        if(!request.getPermissionName().isBlank()) {
            permission.setPermissionName(request.getPermissionName());
        }
        if(!request.getDescription().isBlank()) {
            permission.setDescription(request.getDescription());
        }
        return permissionRepository.save(permission);
    }

    @Override
    public void deletePermission(Integer id) {
        Permission permission = getPermissionById(id);
        permissionRepository.delete(permission);
    }

    private Permission getPermissionById(Integer id) {
        return permissionRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Permission not found with ID: " + id));
    }

}
