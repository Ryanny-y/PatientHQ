package com.patienthq.backend.features.admin;

import com.patienthq.backend.features.admin.dto.request.CreateAdminRequest;
import com.patienthq.backend.features.admin.dto.request.UpdateAdminRequest;
import com.patienthq.backend.features.admin.dto.AdminDto;
import com.patienthq.backend.features.admin.model.Admin;
import com.patienthq.backend.features.admin.service.AdminService;
import com.patienthq.backend.shared.response.ApiResponse;
import com.patienthq.backend.shared.response.PageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admins")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final AdminMapper adminMapper;

    @PostMapping
    public ResponseEntity<ApiResponse<AdminDto>> createAdmin(@Valid @RequestBody CreateAdminRequest request) {
        Admin admin = adminService.createAdmin(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<AdminDto>builder()
                        .success(true)
                        .message("Admin created successfully")
                        .data(adminMapper.toDto(admin))
                        .build()
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<AdminDto>>> getAllAdmins(
            Pageable pageable
    ) {
        Page<Admin> admins = adminService.getAllAdmins(pageable);
        List<AdminDto> adminDtos = admins.map(adminMapper::toDto).stream().toList();

        PageResponse<AdminDto> pageResponse = PageResponse.<AdminDto>builder()
                .content(adminDtos)
                .page(admins.getNumber())
                .size(admins.getSize())
                .totalElements(admins.getTotalElements())
                .totalPages(admins.getTotalPages())
                .first(admins.isFirst())
                .last(admins.isLast())
                .build();

        return ResponseEntity.ok(
                ApiResponse.<PageResponse<AdminDto>>builder()
                        .success(true)
                        .message("Admins retrieved successfully")
                        .data(pageResponse)
                        .build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminDto>> getAdminById(@PathVariable UUID id) {
        Admin admin = adminService.getAdminById(id);
        return ResponseEntity.ok(
                ApiResponse.<AdminDto>builder()
                        .success(true)
                        .message("Admin retrieved successfully")
                        .data(adminMapper.toDto(admin))
                        .build()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminDto>> updateAdmin(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateAdminRequest request) {
        Admin admin = adminService.updateAdmin(id, request);
        return ResponseEntity.ok(
                ApiResponse.<AdminDto>builder()
                        .success(true)
                        .message("Admin updated successfully")
                        .data(adminMapper.toDto(admin))
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAdmin(@PathVariable UUID id) {
        adminService.deleteAdmin(id);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Admin deleted successfully")
                        .data(null)
                        .build()
        );
    }
}
