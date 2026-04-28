package com.patienthq.backend.features.doctor.service;

import com.patienthq.backend.features.admin.exceptions.AdminNotFoundException;
import com.patienthq.backend.features.doctor.dto.request.CreateDoctorRequest;
import com.patienthq.backend.features.doctor.dto.request.UpdateDoctorRequest;
import com.patienthq.backend.features.doctor.model.Doctor;
import com.patienthq.backend.features.doctor.repository.DoctorRepository;
import com.patienthq.backend.features.user.model.Role;
import com.patienthq.backend.features.user.model.User;
import com.patienthq.backend.features.user.repository.RoleRepository;
import com.patienthq.backend.features.user.repository.UserRepository;
import com.patienthq.backend.shared.exceptions.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public Doctor createDoctor(CreateDoctorRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }

        if (doctorRepository.existsByLicenseNumber(request.getLicenseNumber())) {
            throw new IllegalArgumentException("License number already exists");
        }

        Role doctorRole = roleRepository.findByRoleName("DOCTOR")
                .orElseThrow(() -> new IllegalArgumentException("DOCTOR role not found"));

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Password and Confirm Password is incorrect");
        }

        // Create User account for the doctor
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(doctorRole)
                .isActive(true)
                .build();

        user = userRepository.save(user);

        // Create Doctor profile
        Doctor doctor = Doctor.builder()
                .user(user)
                .fullName(request.getFullName())
                .specialization(request.getSpecialization())
                .licenseNumber(request.getLicenseNumber())
                .contactNumber(request.getContactNumber())
                .email(request.getEmail())
                .build();

        doctor = doctorRepository.save(doctor);
        return doctor;
    }

    @Transactional(readOnly = true)
    public Page<Doctor> getAllDoctors(Pageable pageable) {
        return doctorRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Doctor getDoctorById(UUID id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found with id: " + id));
        return doctor;
    }

    @Transactional
    public Doctor updateDoctor(UUID id, UpdateDoctorRequest request) {
        Doctor doctor = findDoctorById(id);

        // Update Fields
        if (request.getFullName() != null) {
            doctor.setFullName(request.getFullName());
        }

        if (request.getEmail() != null) {
            doctor.setEmail(request.getEmail());
        }

        if (request.getContactNumber() != null) {
            doctor.setContactNumber(request.getContactNumber());
        }

        if (request.getLicenseNumber() != null) {
            if (doctorRepository.existsByLicenseNumberAndDoctorIdNot(
                            request.getLicenseNumber(),
                            doctor.getDoctorId()
                    )) {
                throw new IllegalArgumentException("License number already exists");
            }
            doctor.setLicenseNumber(request.getLicenseNumber());
        }

        if (request.getSpecialization() != null) {
            doctor.setSpecialization(request.getSpecialization());
        }

        // Handle user updates if provided (e.g., isActive)
        if (request.getIsActive() != null && doctor.getUser() != null) {
            doctor.getUser().setIsActive(request.getIsActive());
            userRepository.save(doctor.getUser());
        }

        doctor = doctorRepository.save(doctor);
        return doctor;
    }

    @Transactional
    public void deleteDoctor(UUID id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found with id: " + id));

        User user = doctor.getUser();
        doctorRepository.delete(doctor);

        if (user != null) {
            userRepository.delete(user);
        }
    }

    private Doctor findDoctorById(UUID id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new AdminNotFoundException("Doctor profile not found with ID: " + id));
    }
}
