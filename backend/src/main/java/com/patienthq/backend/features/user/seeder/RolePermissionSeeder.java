package com.patienthq.backend.features.user.seeder;

import com.patienthq.backend.features.user.model.Permission;
import com.patienthq.backend.features.user.model.Role;
import com.patienthq.backend.features.user.repository.PermissionRepository;
import com.patienthq.backend.features.user.repository.RoleRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
@RequiredArgsConstructor
public class RolePermissionSeeder {
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    @PostConstruct
    public void seed() {
        // 1. Define roles
        List<String> roles = Arrays.asList("ADMIN", "NURSE", "DOCTOR");
        Map<String, Role> roleMap = new HashMap<>();
        for (String roleName : roles) {
            Role role = roleRepository.findByRoleName(roleName).orElseGet(() -> roleRepository.save(Role.builder().roleName(roleName).build()));
            roleMap.put(roleName, role);
        }

        // 2. Define permissions
        List<Permission> permissions = List.of(
            // Dashboard
            new Permission(null, "DASHBOARD_VIEW", "View dashboard"),
            // User Management
            new Permission(null, "USER_MANAGEMENT_VIEW", "View users"),
            new Permission(null, "USER_MANAGEMENT_CREATE", "Create users"),
            new Permission(null, "USER_MANAGEMENT_UPDATE", "Update users"),
            new Permission(null, "USER_MANAGEMENT_DELETE", "Delete users"),
            // Patient
            new Permission(null, "PATIENT_VIEW", "View patients"),
            new Permission(null, "PATIENT_CREATE", "Create patients"),
            new Permission(null, "PATIENT_UPDATE", "Update patients"),
            new Permission(null, "PATIENT_DELETE", "Delete patients"),
            // Doctor Assignment
            new Permission(null, "DOCTOR_ASSIGNMENT_ASSIGN", "Assign doctors"),
            new Permission(null, "DOCTOR_ASSIGNMENT_VIEW", "View assignments"),
            // Medical Record
            new Permission(null, "MEDICAL_RECORD_VIEW", "View medical records"),
            new Permission(null, "MEDICAL_RECORD_CREATE", "Create medical records"),
            new Permission(null, "MEDICAL_RECORD_UPDATE", "Update medical records"),
            // Vital Signs
            new Permission(null, "VITAL_SIGNS_VIEW", "View vital signs"),
            new Permission(null, "VITAL_SIGNS_CREATE", "Record vital signs"),
            // Appointment
            new Permission(null, "APPOINTMENT_VIEW", "View appointments"),
            new Permission(null, "APPOINTMENT_CREATE", "Create appointments"),
            new Permission(null, "APPOINTMENT_UPDATE", "Update appointments"),
            // Reports
            new Permission(null, "REPORT_VIEW", "View reports"),
            new Permission(null, "REPORT_GENERATE", "Generate reports"),
            // Audit Log
            new Permission(null, "AUDIT_LOG_VIEW", "View audit logs"),
            // Data Integrity
            new Permission(null, "DATA_INTEGRITY_VIEW", "View data integrity"),
            new Permission(null, "DATA_INTEGRITY_VERIFY", "Verify data integrity"),
            // System Settings
            new Permission(null, "SYSTEM_SETTINGS_VIEW", "View system settings"),
            new Permission(null, "SYSTEM_SETTINGS_UPDATE", "Update system settings"),
            // Patient History
            new Permission(null, "PATIENT_HISTORY_VIEW", "View patient history"),
            // Role Management
            new Permission(null, "ROLE_MANAGEMENT_VIEW", "View roles"),
            new Permission(null, "ROLE_MANAGEMENT_CREATE", "Create roles"),
            new Permission(null, "ROLE_MANAGEMENT_UPDATE", "Update roles"),
            new Permission(null, "ROLE_MANAGEMENT_DELETE", "Delete roles"),
            // Permission Management
            new Permission(null, "PERMISSION_MANAGEMENT_VIEW", "View permissions"),
            new Permission(null, "PERMISSION_MANAGEMENT_CREATE", "Create permissions"),
            new Permission(null, "PERMISSION_MANAGEMENT_UPDATE", "Update permissions"),
            new Permission(null, "PERMISSION_MANAGEMENT_DELETE", "Delete permissions")
        );
        Map<String, Permission> permissionMap = new HashMap<>();
        for (Permission perm : permissions) {
            Permission saved = permissionRepository.findAll().stream()
                .filter(p -> p.getPermissionName().equals(perm.getPermissionName()))
                .findFirst()
                .orElseGet(() -> permissionRepository.save(perm));
            permissionMap.put(saved.getPermissionName(), saved);
        }

        // 3. Assign permissions to roles
        Map<String, List<String>> rolePermissions = new HashMap<>();
        rolePermissions.put("ADMIN", List.of(
            "DASHBOARD_VIEW",
            "USER_MANAGEMENT_VIEW", "USER_MANAGEMENT_CREATE", "USER_MANAGEMENT_UPDATE", "USER_MANAGEMENT_DELETE",
            "PATIENT_VIEW", "PATIENT_CREATE", "PATIENT_UPDATE", "PATIENT_DELETE",
            "DOCTOR_ASSIGNMENT_ASSIGN", "DOCTOR_ASSIGNMENT_VIEW",
            "MEDICAL_RECORD_VIEW",
            "VITAL_SIGNS_VIEW",
            "APPOINTMENT_VIEW", "APPOINTMENT_UPDATE",
            "REPORT_VIEW", "REPORT_GENERATE",
            "AUDIT_LOG_VIEW",
            "DATA_INTEGRITY_VIEW", "DATA_INTEGRITY_VERIFY",
            "SYSTEM_SETTINGS_VIEW", "SYSTEM_SETTINGS_UPDATE",
            "PATIENT_HISTORY_VIEW",
            "ROLE_MANAGEMENT_VIEW", "ROLE_MANAGEMENT_CREATE", "ROLE_MANAGEMENT_UPDATE", "ROLE_MANAGEMENT_DELETE",
            "PERMISSION_MANAGEMENT_VIEW", "PERMISSION_MANAGEMENT_CREATE", "PERMISSION_MANAGEMENT_UPDATE", "PERMISSION_MANAGEMENT_DELETE"
        ));
        rolePermissions.put("DOCTOR", List.of(
            "DASHBOARD_VIEW",
            "PATIENT_VIEW",
            "DOCTOR_ASSIGNMENT_VIEW",
            "MEDICAL_RECORD_VIEW", "MEDICAL_RECORD_CREATE", "MEDICAL_RECORD_UPDATE",
            "VITAL_SIGNS_VIEW",
            "APPOINTMENT_VIEW", "APPOINTMENT_CREATE", "APPOINTMENT_UPDATE",
            "REPORT_VIEW", "REPORT_GENERATE",
            "PATIENT_HISTORY_VIEW"
        ));
        rolePermissions.put("NURSE", List.of(
            "DASHBOARD_VIEW",
            "PATIENT_VIEW",
            "VITAL_SIGNS_VIEW", "VITAL_SIGNS_CREATE",
            "MEDICAL_RECORD_VIEW",
            "APPOINTMENT_VIEW",
            "PATIENT_HISTORY_VIEW"
        ));

        for (Map.Entry<String, List<String>> entry : rolePermissions.entrySet()) {
            Role role = roleMap.get(entry.getKey());
            Set<Permission> perms = new HashSet<>();
            for (String permName : entry.getValue()) {
                Permission perm = permissionMap.get(permName);
                if (perm != null) perms.add(perm);
            }
            role.setPermissions(perms);
            roleRepository.save(role);
        }
    }
}
