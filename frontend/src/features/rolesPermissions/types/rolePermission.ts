export interface Role {
  roleId: string;
  roleName: string;
  createdAt: string;
  usersAssigned: number;
  permissionsCount: number;
}

export interface Permission {
  permissionId: string;
  permissionName: string;
  description: string;
}

export type PermissionAssignmentFilter = 'all' | 'assigned' | 'unassigned';
