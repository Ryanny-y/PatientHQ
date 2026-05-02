package com.patienthq.backend.features.doctor_assignment;

import com.patienthq.backend.features.doctor_assignment.dto.DoctorAssignmentDto;
import com.patienthq.backend.features.doctor_assignment.model.DoctorAssignment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DoctorAssignmentMapper {

    @Mapping(source = "patient.patientId", target = "patientId")
    @Mapping(source = "patient.fullName", target = "patientName")
    @Mapping(source = "patient.status", target = "patientStatus")
    @Mapping(source = "doctor.doctorId", target = "doctorId")
    @Mapping(source = "doctor.fullName", target = "doctorName")
    @Mapping(source = "doctor.specialization", target = "doctorSpecialization")
    DoctorAssignmentDto toDto(DoctorAssignment assignment);
}