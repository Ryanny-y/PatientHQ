package com.patienthq.backend.features.doctor;

import com.patienthq.backend.features.doctor.dto.DoctorDto;
import com.patienthq.backend.features.doctor.model.Doctor;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DoctorMapper {

    @Mapping(source = "user.userId", target = "userId")
    @Mapping(source = "user.username", target = "username")
    @Mapping(source = "user.role.roleName", target = "roleName")
    @Mapping(source = "user.isActive", target = "isActive")
    @Mapping(source = "user.createdAt", target = "createdAt")
    DoctorDto toDto(Doctor doctor);
}
