import type { Role, Permission, PermissionWithStatus } from '../types/roles.ts';

// Mock data
const mockRoles: Role[] = [
  { id: '1', name: 'ADMIN', createdAt: '2023-01-01', userCount: 12, permissionCount: 18 },
  { id: '2', name: 'DOCTOR', createdAt: '2023-01-02', userCount: 25, permissionCount: 7 },
  { id: '3', name: 'NURSE', createdAt: '2023-01-03', userCount: 30, permissionCount: 5 },
];

const mockPermissions: Permission[] = [
  { id: '1', name: 'VIEW_PATIENTS', description: 'Can view patient records' },
  { id: '2', name: 'EDIT_PATIENTS', description: 'Can edit patient data' },
  { id: '3', name: 'DELETE_PATIENTS', description: 'Can delete patient records' },
  { id: '4', name: 'MANAGE_DOCTORS', description: 'Can manage doctor accounts' },
  { id: '5', name: 'CREATE_REPORTS', description: 'Can create reports' },
];

// Mock role permissions
const mockRolePermissions: Record<string, string[]> = {
  '1': ['1', '2', '3', '4', '5'], // ADMIN has all
  '2': ['1', '2'], // DOCTOR has view and edit patients
  '3': ['1'], // NURSE has view patients
};

export const getRoles = async (): Promise<Role[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockRoles;
};

export const createRole = async (role: Omit<Role, 'id' | 'userCount' | 'permissionCount'>): Promise<Role> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newRole: Role = {
    ...role,
    id: Date.now().toString(),
    userCount: 0,
    permissionCount: 0,
  };
  mockRoles.push(newRole);
  return newRole;
};

export const updateRole = async (id: string, updates: Partial<Pick<Role, 'name'>>): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const role = mockRoles.find(r => r.id === id);
  if (role) {
    Object.assign(role, updates);
  }
};

export const deleteRole = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockRoles.findIndex(r => r.id === id);
  if (index !== -1) {
    mockRoles.splice(index, 1);
    delete mockRolePermissions[id];
  }
};

export const getPermissions = async (): Promise<Permission[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockPermissions;
};

export const createPermission = async (permission: Omit<Permission, 'id'>): Promise<Permission> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newPermission: Permission = {
    ...permission,
    id: Date.now().toString(),
  };
  mockPermissions.push(newPermission);
  return newPermission;
};

export const getRolePermissions = async (roleId: string): Promise<PermissionWithStatus[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const assignedIds = mockRolePermissions[roleId] || [];
  return mockPermissions.map(p => ({
    ...p,
    assigned: assignedIds.includes(p.id),
  }));
};

export const updateRolePermissions = async (roleId: string, permissionIds: string[]): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  mockRolePermissions[roleId] = permissionIds;
  // Update permission count
  const role = mockRoles.find(r => r.id === roleId);
  if (role) {
    role.permissionCount = permissionIds.length;
  }
};