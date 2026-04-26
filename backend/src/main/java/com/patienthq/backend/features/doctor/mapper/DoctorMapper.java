package com.patienthq.backend.features.doctor.mapper;

import com.patienthq.backend.features.doctor.dto.DoctorDto;
import com.patienthq.backend.features.doctor.model.Doctor;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DoctorMapper {

    @Mapping(source = "user.username", target = "username")
    @Mapping(source = "user.isActive", target = "isActive")
    DoctorDto toDto(Doctor doctor);
}
