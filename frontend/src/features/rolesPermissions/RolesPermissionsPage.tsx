import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { RolesList } from './components/RolesList.tsx';
import { RoleDetails } from './components/RoleDetails.tsx';
import { SummaryCards } from './components/SummaryCards.tsx';
import { AddRoleModal } from './components/AddRoleModal.tsx';
import { AddPermissionModal } from './components/AddPermissionModal.tsx';
import type { Role } from './types/roles.ts';
import { PermissionsList } from './components/PermissionsList.tsx';
import { PERMISSIONS, usePermissions } from '@/shared/security/permissions';

const RolesPermissionsPage = () => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showAddRole, setShowAddRole] = useState(false);
  const [showAddPermission, setShowAddPermission] = useState(false);
  const { can } = usePermissions();
  const canCreateRole = can(PERMISSIONS.ROLE_MANAGEMENT_CREATE);
  const canCreatePermission = can(PERMISSIONS.PERMISSION_MANAGEMENT_CREATE);

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Roles & Permissions</h1>
          <p className="text-gray-600">Manage user roles, access rights, and security permissions.</p>
        </div>
        <div className="flex gap-2">
          {canCreateRole && <Button onClick={() => setShowAddRole(true)}>+ Add Role</Button>}
          {canCreatePermission && <Button onClick={() => setShowAddPermission(true)}>+ Add Permission</Button>}
        </div>
      </div>
      <SummaryCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RolesList onSelectRole={setSelectedRole} />
        <RoleDetails role={selectedRole} />
      </div>
      <div className="mt-6">
        <PermissionsList />
      </div>
      {canCreateRole && showAddRole && <AddRoleModal onClose={() => setShowAddRole(false)} onRoleCreated={setSelectedRole} />}
      {canCreatePermission && showAddPermission && <AddPermissionModal onClose={() => setShowAddPermission(false)} />}
    </div>
  );
};

export default RolesPermissionsPage;
