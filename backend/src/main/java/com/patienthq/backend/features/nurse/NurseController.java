package com.patienthq.backend.features.nurse;

import com.patienthq.backend.features.nurse.dto.NurseDto;
import com.patienthq.backend.features.nurse.dto.request.CreateNurseRequest;
import com.patienthq.backend.features.nurse.dto.request.UpdateNurseRequest;
import com.patienthq.backend.features.nurse.model.Nurse;
import com.patienthq.backend.features.nurse.service.NurseService;
import com.patienthq.backend.shared.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/nurses")
@RequiredArgsConstructor
public class NurseController {

    private final NurseService nurseService;
    private final NurseMapper nurseMapper;

    @PostMapping
    public ResponseEntity<ApiResponse<NurseDto>> createNurse(
            @Valid @RequestBody CreateNurseRequest request) {

        Nurse nurse = nurseService.createNurse(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<NurseDto>builder()
                        .success(true)
                        .message("Nurse created successfully")
                        .data(nurseMapper.toDto(nurse))
                        .build()
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<NurseDto>>> getAllNurses() {

        List<NurseDto> nurses = nurseService.getAllNurses()
                .stream()
                .map(nurseMapper::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                ApiResponse.<List<NurseDto>>builder()
                        .success(true)
                        .message("Nurses retrieved successfully")
                        .data(nurses)
                        .build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<NurseDto>> getNurseById(@PathVariable UUID id) {

        Nurse nurse = nurseService.getNurseById(id);

        return ResponseEntity.ok(
                ApiResponse.<NurseDto>builder()
                        .success(true)
                        .message("Nurse retrieved successfully")
                        .data(nurseMapper.toDto(nurse))
                        .build()
        );
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<NurseDto>> updateNurse(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateNurseRequest request) {

        Nurse nurse = nurseService.updateNurse(id, request);

        return ResponseEntity.ok(
                ApiResponse.<NurseDto>builder()
                        .success(true)
                        .message("Nurse updated successfully")
                        .data(nurseMapper.toDto(nurse))
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNurse(@PathVariable UUID id) {

        nurseService.deleteNurse(id);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Nurse deleted successfully")
                        .data(null)
                        .build()
        );
    }
}