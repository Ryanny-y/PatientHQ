package com.patienthq.backend.features.user.service;

import com.patienthq.backend.features.user.dto.request.CreatePermissionRequest;
import com.patienthq.backend.features.user.dto.request.UpdatePermissionRequest;
import com.patienthq.backend.features.user.model.Permission;

import java.util.List;

public interface PermissionService {
    List<Permission> getAllPermission();
    Permission createPermission(CreatePermissionRequest request);
    Permission updatePermission(Integer id, UpdatePermissionRequest request);
    void deletePermission(Integer id);
}
