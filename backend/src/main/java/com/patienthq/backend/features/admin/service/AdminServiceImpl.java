package com.patienthq.backend.features.admin.service;

import com.patienthq.backend.features.admin.dto.request.CreateAdminRequest;
import com.patienthq.backend.features.admin.dto.request.UpdateAdminRequest;
import com.patienthq.backend.features.admin.exceptions.AdminNotFoundException;
import com.patienthq.backend.features.admin.model.Admin;
import com.patienthq.backend.features.admin.repository.AdminRepository;
import com.patienthq.backend.features.user.model.Role;
import com.patienthq.backend.features.user.model.User;
import com.patienthq.backend.features.user.repository.RoleRepository;
import com.patienthq.backend.features.user.repository.UserRepository;
import com.patienthq.backend.shared.exceptions.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public Admin createAdmin(CreateAdminRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Username already exists");
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Passwords do not match");
        }

        Role adminRole = roleRepository.findByRoleName("ADMIN")
                .orElseThrow(() -> new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "ADMIN role not found"));

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(adminRole);
        
        User savedUser = userRepository.save(user);

        Admin admin = new Admin();
        admin.setUser(savedUser);
        admin.setFullName(request.getFullName());
        admin.setContactNumber(request.getContactNumber());
        admin.setEmail(request.getEmail());

        return adminRepository.save(admin);
    }

    @Override
    public Admin getAdminById(Integer adminId) {
        return findAdminById(adminId);
    }

    @Override
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    @Override
    @Transactional
    public Admin updateAdmin(Integer adminId, UpdateAdminRequest request) {
        Admin admin = findAdminById(adminId);

        admin.setFullName(request.getFullName());
        admin.setContactNumber(request.getContactNumber());
        admin.setEmail(request.getEmail());

        User user = admin.getUser();
        if (request.getUsername() != null && !request.getUsername().isBlank()) {
            // Check if username is taken by another user
            userRepository.findByUsername(request.getUsername()).ifPresent(existingUser -> {
                if (!existingUser.getId().equals(user.getId())) {
                    throw new AppException(HttpStatus.BAD_REQUEST, "Username already exists");
                }
            });
            user.setUsername(request.getUsername());
        }

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            if (request.getConfirmPassword() == null || request.getConfirmPassword().isBlank()) {
                throw new AppException(HttpStatus.BAD_REQUEST, "Confirm password is required");
            }
            if (!request.getPassword().equals(request.getConfirmPassword())) {
                throw new AppException(HttpStatus.BAD_REQUEST, "Passwords do not match");
            }
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        userRepository.save(user);
        return adminRepository.save(admin);
    }

    @Override
    @Transactional
    public void deleteAdmin(Integer adminId) {
        Admin admin = findAdminById(adminId);
        User user = admin.getUser();
        
        adminRepository.delete(admin);
        userRepository.delete(user);
    }

    private Admin findAdminById(Integer adminId) {
        return adminRepository.findById(adminId)
                .orElseThrow(() -> new AdminNotFoundException("Admin profile not found with ID: " + adminId));
    }
}
