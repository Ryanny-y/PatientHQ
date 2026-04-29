package com.patienthq.backend.features.user.service;

import com.patienthq.backend.features.user.dto.request.CreateRoleRequest;
import com.patienthq.backend.features.user.dto.request.UpdateRoleRequest;
import com.patienthq.backend.features.user.model.Role;
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

    private Role getRoleById(Integer id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Role not found with ID: " + id));
    }

}
