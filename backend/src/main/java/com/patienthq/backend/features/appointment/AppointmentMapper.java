package com.patienthq.backend.features.appointment;

import com.patienthq.backend.features.appointment.dto.AppointmentDto;
import com.patienthq.backend.features.appointment.model.Appointment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AppointmentMapper {

    @Mapping(source = "patient.patientId", target = "patientId")
    @Mapping(source = "patient.fullName", target = "patientName")
    @Mapping(source = "doctor.doctorId", target = "doctorId")
    @Mapping(source = "doctor.fullName", target = "doctorName")
    @Mapping(source = "doctor.specialization", target = "doctorSpecialization")
    AppointmentDto toDto(Appointment appointment);
}
