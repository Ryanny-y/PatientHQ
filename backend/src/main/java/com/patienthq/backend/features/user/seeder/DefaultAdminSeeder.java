package com.patienthq.backend.features.user.seeder;

import com.patienthq.backend.features.admin.model.Admin;
import com.patienthq.backend.features.admin.repository.AdminRepository;
import com.patienthq.backend.features.user.model.Role;
import com.patienthq.backend.features.user.model.User;
import com.patienthq.backend.features.user.repository.RoleRepository;
import com.patienthq.backend.features.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.DependsOn;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@DependsOn("rolePermissionSeeder")
@RequiredArgsConstructor
public class DefaultAdminSeeder implements ApplicationRunner {
    private static final String ADMIN_ROLE = "ADMIN";
    private static final String DEFAULT_USERNAME = "adminuser";
    private static final String DEFAULT_PASSWORD = "adminpassword";
    private static final String DEFAULT_FULL_NAME = "Admin";
    private static final String DEFAULT_EMAIL = "admin@gmail.com";
    private static final String DEFAULT_CONTACT_NUMBER = "09123456789";

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        Role adminRole = roleRepository.findByRoleName(ADMIN_ROLE)
                .orElseThrow(() -> new IllegalStateException("ADMIN role not found"));

        User adminUser = userRepository.findByUsername(DEFAULT_USERNAME)
                .orElseGet(() -> createDefaultAdminUser(adminRole));

        boolean userUpdated = false;
        if (adminUser.getRole() == null || !ADMIN_ROLE.equals(adminUser.getRole().getRoleName())) {
            adminUser.setRole(adminRole);
            userUpdated = true;
        }
        if (!Boolean.TRUE.equals(adminUser.getIsActive())) {
            adminUser.setIsActive(true);
            userUpdated = true;
        }
        if (userUpdated) {
            adminUser = userRepository.save(adminUser);
        }

        User savedAdminUser = adminUser;
        adminRepository.findByUser_UserId(savedAdminUser.getUserId())
                .orElseGet(() -> adminRepository.save(Admin.builder()
                        .user(savedAdminUser)
                        .fullName(DEFAULT_FULL_NAME)
                        .email(DEFAULT_EMAIL)
                        .contactNumber(DEFAULT_CONTACT_NUMBER)
                        .build()));
    }

    private User createDefaultAdminUser(Role adminRole) {
        return userRepository.save(User.builder()
                .username(DEFAULT_USERNAME)
                .password(passwordEncoder.encode(DEFAULT_PASSWORD))
                .role(adminRole)
                .isActive(true)
                .build());
    }
}
