package com.patienthq.backend.features.admin;

import com.patienthq.backend.features.admin.dto.request.CreateAdminRequest;
import com.patienthq.backend.features.admin.dto.request.UpdateAdminRequest;
import com.patienthq.backend.features.admin.model.Admin;

import java.util.List;

public interface AdminService {
    Admin createAdmin(CreateAdminRequest request);
    Admin getAdminById(Integer adminId);
    List<Admin> getAllAdmins();
    Admin updateAdmin(Integer adminId, UpdateAdminRequest request);
    void deleteAdmin(Integer adminId);
}
