package com.patienthq.backend.features.user.service;

import com.patienthq.backend.features.user.dto.request.CreateRoleRequest;
import com.patienthq.backend.features.user.dto.request.UpdateRoleRequest;
import com.patienthq.backend.features.user.model.Role;

import java.util.List;

public interface RoleService {
    List<Role> getAllRoles();
    Role createRole(CreateRoleRequest request);
    Role updateRole(Integer id, UpdateRoleRequest request);
    void deleteRole(Integer id);
    void addPermissionsToRole(Integer roleId, List<Integer> permissionIds);
}
