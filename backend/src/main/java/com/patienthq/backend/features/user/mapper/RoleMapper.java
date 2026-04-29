package com.patienthq.backend.features.user.mapper;

import com.patienthq.backend.features.user.dto.RoleDto;
import com.patienthq.backend.features.user.model.Role;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedSourcePolicy = ReportingPolicy.IGNORE)
public interface RoleMapper {

    RoleDto toDto(Role role);

}
