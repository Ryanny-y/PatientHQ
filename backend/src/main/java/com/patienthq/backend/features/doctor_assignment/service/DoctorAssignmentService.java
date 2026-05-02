package com.patienthq.backend.features.doctor_assignment.service;

import com.patienthq.backend.features.doctor_assignment.dto.DoctorAssignmentDto;
import com.patienthq.backend.features.doctor_assignment.dto.request.AssignDoctorRequest;
import com.patienthq.backend.features.doctor_assignment.dto.request.ReassignDoctorRequest;
import com.patienthq.backend.features.doctor_assignment.model.DoctorAssignment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface DoctorAssignmentService {

    DoctorAssignmentDto assignDoctorToPatient(AssignDoctorRequest request);

    Page<DoctorAssignmentDto> getAllDoctorAssignments(Boolean activeOnly, Pageable pageable);

    DoctorAssignmentDto reassignDoctor(ReassignDoctorRequest request);

    void deleteDoctorAssignment(UUID assignmentId);

    DoctorAssignmentDto getDoctorAssignmentById(UUID assignmentId);
}