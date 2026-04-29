package com.patienthq.backend.features.user.mapper;

import com.patienthq.backend.features.user.dto.PermissionDto;
import com.patienthq.backend.features.user.model.Permission;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedSourcePolicy = ReportingPolicy.IGNORE)
public interface PermissionMapper {

    PermissionDto toDto(Permission permission);
}
