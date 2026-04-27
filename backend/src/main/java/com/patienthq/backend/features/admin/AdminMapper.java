package com.patienthq.backend.features.admin;

import com.patienthq.backend.features.admin.dto.AdminDto;
import com.patienthq.backend.features.admin.model.Admin;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AdminMapper {

    @Mapping(source = "user.userId", target = "userId")
    @Mapping(source = "user.username", target = "username")
    @Mapping(source = "user.role.roleName", target = "roleName")
    @Mapping(source = "user.isActive", target = "isActive")
    @Mapping(source = "user.createdAt", target = "createdAt")
    AdminDto toDto(Admin admin);
}
