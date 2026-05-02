package com.patienthq.backend.features.doctor_assignment.service;

import com.patienthq.backend.features.doctor.model.Doctor;
import com.patienthq.backend.features.doctor.repository.DoctorRepository;
import com.patienthq.backend.features.doctor_assignment.dto.DoctorAssignmentDto;
import com.patienthq.backend.features.doctor_assignment.dto.DoctorAssignmentMetadataDto;
import com.patienthq.backend.features.doctor_assignment.dto.request.AssignDoctorRequest;
import com.patienthq.backend.features.doctor_assignment.dto.request.ReassignDoctorRequest;
import com.patienthq.backend.features.doctor_assignment.exceptions.DoctorAssignmentException.*;
import com.patienthq.backend.features.doctor_assignment.model.DoctorAssignment;
import com.patienthq.backend.features.doctor_assignment.repository.DoctorAssignmentRepository;
import com.patienthq.backend.features.patient.model.Patient;
import com.patienthq.backend.features.patient.model.PatientStatus;
import com.patienthq.backend.features.patient.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class DoctorAssignmentServiceImpl implements DoctorAssignmentService {

    private final DoctorAssignmentRepository doctorAssignmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    @Override
    @Transactional
    public DoctorAssignmentDto assignDoctorToPatient(AssignDoctorRequest request) {
        // Validate patient exists and is active
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new PatientNotFoundException(request.getPatientId()));

        if (patient.getStatus() != PatientStatus.ACTIVE && patient.getStatus() != PatientStatus.ADMITTED) {
            throw new PatientNotActiveException(patient.getFullName());
        }


        // Validate doctor exists and is active
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new DoctorNotFoundException(request.getDoctorId()));

        if (!doctor.getUser().getIsActive()) {
            throw new DoctorNotActiveException(doctor.getFullName());
        }

        // Check if patient already has an active assignment
        if (doctorAssignmentRepository.existsByPatientPatientIdAndIsActiveTrue(request.getPatientId())) {
            throw new PatientAlreadyAssignedException(patient.getFullName());
        }

        // Create new assignment
        DoctorAssignment assignment = DoctorAssignment.builder()
                .patient(patient)
                .doctor(doctor)
                .isActive(true)
                .build();

        DoctorAssignment savedAssignment = doctorAssignmentRepository.save(assignment);

        log.info("Assigned doctor {} to patient {}", doctor.getFullName(), patient.getFullName());

        return mapToDto(savedAssignment);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DoctorAssignment> getAllDoctorAssignments(String search, Boolean isActive, PatientStatus patientStatus, Pageable pageable) {
        String formattedSearch = (search == null) ? null : "%" + search.toLowerCase() + "%";
        return doctorAssignmentRepository.findAllAssignments(formattedSearch, isActive, patientStatus, pageable);
    }

    @Override
    @Transactional
    public DoctorAssignmentDto reassignDoctor(ReassignDoctorRequest request) {
        // Find existing assignment
        DoctorAssignment assignment = doctorAssignmentRepository.findById(request.getAssignmentId())
                .orElseThrow(() -> new AssignmentNotFoundException(request.getAssignmentId()));

        // Validate new doctor exists and is active
        Doctor newDoctor = doctorRepository.findById(request.getNewDoctorId())
                .orElseThrow(() -> new DoctorNotFoundException(request.getNewDoctorId()));

        if (!newDoctor.getUser().getIsActive()) {
            throw new DoctorNotActiveException(newDoctor.getFullName());
        }

        // Check if patient already has another active assignment to this doctor
        if (doctorAssignmentRepository.existsByDoctorDoctorIdAndPatientPatientIdAndIsActiveTrue(
                request.getNewDoctorId(), assignment.getPatient().getPatientId())) {
            throw new PatientAlreadyAssignedException(assignment.getPatient().getFullName());
        }

        // Deactivate current assignment
        assignment.setIsActive(false);
        doctorAssignmentRepository.save(assignment);

        // Create new assignment
        DoctorAssignment newAssignment = DoctorAssignment.builder()
                .patient(assignment.getPatient())
                .doctor(newDoctor)
                .isActive(true)
                .build();

        DoctorAssignment savedNewAssignment = doctorAssignmentRepository.save(newAssignment);

        log.info("Reassigned patient {} from doctor {} to doctor {}",
                assignment.getPatient().getFullName(),
                assignment.getDoctor().getFullName(),
                newDoctor.getFullName());

        return mapToDto(savedNewAssignment);
    }

    @Override
    @Transactional
    public void deleteDoctorAssignment(UUID assignmentId) {
        DoctorAssignment assignment = doctorAssignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new AssignmentNotFoundException(assignmentId));

        doctorAssignmentRepository.delete(assignment);

        log.info("Deleted doctor assignment for patient {} and doctor {}",
                assignment.getPatient().getFullName(),
                assignment.getDoctor().getFullName());
    }

    @Override
    @Transactional(readOnly = true)
    public DoctorAssignmentDto getDoctorAssignmentById(UUID assignmentId) {
        DoctorAssignment assignment = doctorAssignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new AssignmentNotFoundException(assignmentId));

        return mapToDto(assignment);
    }

    @Override
    @Transactional(readOnly = true)
    public DoctorAssignmentMetadataDto getDoctorAssignmentMetadata() {
        long activeAssignments = doctorAssignmentRepository.countActiveAssignments();
        long unassignedPatients = doctorAssignmentRepository.countUnassignedPatients();
        long availableDoctors = doctorAssignmentRepository.countAvailableDoctors();
        long highWorkloadDoctors = doctorAssignmentRepository.countHighWorkloadDoctors();

        return DoctorAssignmentMetadataDto.builder()
                .activeAssignments(activeAssignments)
                .unassignedPatients(unassignedPatients)
                .availableDoctors(availableDoctors)
                .highWorkloadDoctors(highWorkloadDoctors)
                .build();
    }

    private DoctorAssignmentDto mapToDto(DoctorAssignment assignment) {
        return DoctorAssignmentDto.builder()
                .assignmentId(assignment.getAssignmentId())
                .patientId(assignment.getPatient().getPatientId())
                .patientName(assignment.getPatient().getFullName())
                .doctorId(assignment.getDoctor().getDoctorId())
                .doctorName(assignment.getDoctor().getFullName())
                .doctorSpecialization(assignment.getDoctor().getSpecialization())
                .assignedDate(assignment.getAssignedDate())
                .isActive(assignment.getIsActive())
                .build();
    }
}