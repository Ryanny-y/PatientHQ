package com.patienthq.backend.features.user.service;

import com.patienthq.backend.features.user.dto.request.CreateRoleRequest;
import com.patienthq.backend.features.user.dto.request.UpdateRoleRequest;
import com.patienthq.backend.features.user.model.Permission;
import com.patienthq.backend.features.user.model.Role;
import com.patienthq.backend.features.user.repository.PermissionRepository;
import com.patienthq.backend.features.user.repository.RoleRepository;
import com.patienthq.backend.shared.exceptions.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    @Override
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @Override
    public Role createRole(CreateRoleRequest request) {
        Role role = Role.builder()
                .roleName(request.getRoleName())
                .build();

        return roleRepository.save(role);
    }

    @Override
    @Transactional
    public Role updateRole(Integer id, UpdateRoleRequest request) {
        Role role = getRoleById(id);

        if(!request.getRoleName().isBlank()) {
            role.setRoleName(request.getRoleName());
        }

        return roleRepository.save(role);
    }

    @Override
    @Transactional
    public void deleteRole(Integer id) {
        Role role = getRoleById(id);
        roleRepository.delete(role);
    }

    @Override
    @Transactional
    public void addPermissionsToRole(Integer roleId, List<Integer> permissionIds) {
        Role role = getRoleById(roleId);

        if (permissionIds == null || permissionIds.isEmpty()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Permission IDs cannot be empty");
        }

        List<Permission> permissions = permissionRepository.findAllById(permissionIds);

        if (permissions.size() != permissionIds.size()) {
            throw new AppException(HttpStatus.NOT_FOUND, "One or more permissions not found");
        }

        role.getPermissions().addAll(permissions);

        roleRepository.save(role);
    }

    @Override
    public List<Permission> getRolePermissions(Integer roleId) {
        Role role = getRoleById(roleId);
        return role.getPermissions().stream().toList();
    }

    private Role getRoleById(Integer id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Role not found with ID: " + id));
    }

}
