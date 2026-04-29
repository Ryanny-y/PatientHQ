export interface Role {
  id: string;
  roleName: string;
  createdAt: string;
  userCount: number;
  permissionCount: number;
}

export interface Permission {
  id: string;
  permissionName: string;
  description: string;
}

export interface PermissionWithStatus extends Permission {
  assigned: boolean;
}