package com.patienthq.backend.features.nurse.service;

import com.patienthq.backend.features.nurse.dto.request.CreateNurseRequest;
import com.patienthq.backend.features.nurse.dto.request.UpdateNurseRequest;
import com.patienthq.backend.features.nurse.model.Nurse;
import com.patienthq.backend.features.nurse.repository.NurseRepository;
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
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NurseServiceImpl implements NurseService {

    private final NurseRepository nurseRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public Nurse createNurse(CreateNurseRequest request) {

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }

        if (request.getLicenseNumber() != null &&
                nurseRepository.existsByLicenseNumber(request.getLicenseNumber())) {
            throw new IllegalArgumentException("License number already exists");
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Password and Confirm Password is incorrect");
        }

        Role nurseRole = roleRepository.findByRoleName("NURSE")
                .orElseThrow(() -> new IllegalArgumentException("NURSE role not found"));

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(nurseRole)
                .isActive(true)
                .build();

        user = userRepository.save(user);

        Nurse nurse = Nurse.builder()
                .user(user)
                .fullName(request.getFullName())
                .assignedWard(request.getAssignedWard())
                .licenseNumber(request.getLicenseNumber())
                .contactNumber(request.getContactNumber())
                .email(request.getEmail())
                .build();

        return nurseRepository.save(nurse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Nurse> getAllNurses() {
        return nurseRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Nurse getNurseById(UUID id) {
        return nurseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Nurse not found with id: " + id));
    }

    @Override
    @Transactional
    public Nurse updateNurse(UUID id, UpdateNurseRequest request) {
        Nurse nurse = findNurseById(id);

        if (request.getFullName() != null) {
            nurse.setFullName(request.getFullName());
        }

        if (request.getAssignedWard() != null) {
            nurse.setAssignedWard(request.getAssignedWard());
        }

        if (request.getEmail() != null) {
            nurse.setEmail(request.getEmail());
        }

        if (request.getContactNumber() != null) {
            nurse.setContactNumber(request.getContactNumber());
        }

        if (request.getLicenseNumber() != null) {

            if (nurseRepository.existsByLicenseNumberAndNurseIdNot(
                    request.getLicenseNumber(),
                    nurse.getNurseId()
            )) {
                throw new IllegalArgumentException("License number already exists");
            }

            nurse.setLicenseNumber(request.getLicenseNumber());
        }

        if (request.getIsActive() != null && nurse.getUser() != null) {
            nurse.getUser().setIsActive(request.getIsActive());
        }

        return nurseRepository.save(nurse);
    }

    @Override
    @Transactional
    public void deleteNurse(UUID id) {
        Nurse nurse = findNurseById(id);

        User user = nurse.getUser();
        nurseRepository.delete(nurse);

        if (user != null) {
            userRepository.delete(user);
        }
    }

    private Nurse findNurseById(UUID id) {
        return nurseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Nurse not found with id: " + id));
    }
}