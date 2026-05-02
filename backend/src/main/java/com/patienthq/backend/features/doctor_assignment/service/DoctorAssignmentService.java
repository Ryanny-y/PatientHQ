package com.patienthq.backend.features.doctor_assignment.service;

import com.patienthq.backend.features.doctor_assignment.dto.DoctorAssignmentDto;
import com.patienthq.backend.features.doctor_assignment.dto.DoctorAssignmentMetadataDto;
import com.patienthq.backend.features.doctor_assignment.dto.request.AssignDoctorRequest;
import com.patienthq.backend.features.doctor_assignment.dto.request.ReassignDoctorRequest;
import com.patienthq.backend.features.doctor_assignment.model.DoctorAssignment;
import com.patienthq.backend.features.patient.model.PatientStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface DoctorAssignmentService {

    DoctorAssignmentDto assignDoctorToPatient(AssignDoctorRequest request);

    Page<DoctorAssignment> getAllDoctorAssignments(String search, Boolean isActive, PatientStatus patientStatus, Pageable pageable);

    DoctorAssignmentDto reassignDoctor(ReassignDoctorRequest request);

    void deleteDoctorAssignment(UUID assignmentId);

    DoctorAssignmentDto getDoctorAssignmentById(UUID assignmentId);

    DoctorAssignmentMetadataDto getDoctorAssignmentMetadata();
}