package com.patienthq.backend.features.admin.service;

import com.patienthq.backend.features.admin.dto.AdminMetadataDto;
import com.patienthq.backend.features.admin.dto.request.CreateAdminRequest;
import com.patienthq.backend.features.admin.dto.request.UpdateAdminRequest;
import com.patienthq.backend.features.admin.model.Admin;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface AdminService {
    Admin createAdmin(CreateAdminRequest request);
    Admin getAdminById(UUID adminId);
    Page<Admin> getAllAdmins(Boolean isActive, String search, Pageable pageable);
    AdminMetadataDto getAdminMetadata();
    Admin updateAdmin(UUID adminId, UpdateAdminRequest request);
    void deleteAdmin(UUID adminId);
}
