package com.patienthq.backend.features.admin;

import com.patienthq.backend.features.admin.dto.request.CreateAdminRequest;
import com.patienthq.backend.features.admin.dto.request.UpdateAdminRequest;
import com.patienthq.backend.features.admin.dto.response.AdminResponse;
import com.patienthq.backend.features.admin.model.Admin;
import com.patienthq.backend.features.admin.service.AdminService;
import com.patienthq.backend.shared.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admins")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final AdminMapper adminMapper;

    @PostMapping
    public ResponseEntity<ApiResponse<AdminResponse>> createAdmin(@Valid @RequestBody CreateAdminRequest request) {
        Admin admin = adminService.createAdmin(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<AdminResponse>builder()
                        .success(true)
                        .message("Admin created successfully")
                        .data(adminMapper.toResponse(admin))
                        .build()
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminResponse>>> getAllAdmins() {
        List<AdminResponse> admins = adminService.getAllAdmins().stream()
                .map(adminMapper::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                ApiResponse.<List<AdminResponse>>builder()
                        .success(true)
                        .message("Admins retrieved successfully")
                        .data(admins)
                        .build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminResponse>> getAdminById(@PathVariable Integer id) {
        Admin admin = adminService.getAdminById(id);
        return ResponseEntity.ok(
                ApiResponse.<AdminResponse>builder()
                        .success(true)
                        .message("Admin retrieved successfully")
                        .data(adminMapper.toResponse(admin))
                        .build()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminResponse>> updateAdmin(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateAdminRequest request) {
        Admin admin = adminService.updateAdmin(id, request);
        return ResponseEntity.ok(
                ApiResponse.<AdminResponse>builder()
                        .success(true)
                        .message("Admin updated successfully")
                        .data(adminMapper.toResponse(admin))
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAdmin(@PathVariable Integer id) {
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
