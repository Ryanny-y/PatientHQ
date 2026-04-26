package com.patienthq.backend.features.admin.service;

import com.patienthq.backend.features.admin.dto.request.CreateAdminRequest;
import com.patienthq.backend.features.admin.dto.request.UpdateAdminRequest;
import com.patienthq.backend.features.admin.model.Admin;

import java.util.List;
import java.util.UUID;

public interface AdminService {
    Admin createAdmin(CreateAdminRequest request);
    Admin getAdminById(UUID adminId);
    List<Admin> getAllAdmins();
    Admin updateAdmin(UUID adminId, UpdateAdminRequest request);
    void deleteAdmin(UUID adminId);
}
