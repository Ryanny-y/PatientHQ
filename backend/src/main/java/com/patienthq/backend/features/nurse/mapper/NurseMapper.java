package com.patienthq.backend.features.nurse.mapper;

import com.patienthq.backend.features.nurse.dto.NurseDto;
import com.patienthq.backend.features.nurse.model.Nurse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedSourcePolicy = ReportingPolicy.IGNORE)
public interface NurseMapper {

    @Mapping(source = "user.username", target = "username")
    @Mapping(source = "user.isActive", target = "isActive")
    NurseDto toDto(Nurse nurse);
}
