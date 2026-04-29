package com.patienthq.backend.features.user.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class AssignPermissionsRequest {
    private List<Integer> permissionIds;
}