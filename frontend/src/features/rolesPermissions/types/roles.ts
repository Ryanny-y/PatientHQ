export interface Role {
  id: string;
  name: string;
  createdAt: string;
  userCount: number;
  permissionCount: number;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface PermissionWithStatus extends Permission {
  assigned: boolean;
}