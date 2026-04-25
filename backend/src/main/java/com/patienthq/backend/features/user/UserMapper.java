package com.patienthq.backend.features.user;

import com.patienthq.backend.features.user.dto.UserDto;
import com.patienthq.backend.features.user.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "role", source = "role.roleName")
    UserDto toDto(User user);
}
