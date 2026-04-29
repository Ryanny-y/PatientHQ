import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Role } from '../types/roles.ts';
import { EditRoleModal } from './EditRoleModal';
import { DeleteRoleModal } from './DeleteRoleModal';
import { PermissionsTable } from './PermissionsTable';

interface RoleDetailsProps {
  role: Role | null;
}

const RoleDetails = ({ role }: RoleDetailsProps) => {
  const [editingRole, setEditingRole] = useState(false);
  const [deletingRole, setDeletingRole] = useState(false);
  if (!role) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-gray-500">Select a role to view details</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{role.roleName}</CardTitle>
            <p className="text-sm text-gray-600">ID: {role.id}</p>
            <p className="text-sm text-gray-600">Created: {new Date(role.createdAt).toLocaleDateString()}</p>
            <p className="text-sm text-gray-600">Users Assigned: {role.userCount}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditingRole(true)}>Edit Role</Button>
            <Button variant="destructive" onClick={() => setDeletingRole(true)}>Delete Role</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <PermissionsTable roleId={role.id} />
      </CardContent>
      {editingRole && role && <EditRoleModal role={role} onClose={() => setEditingRole(false)} />}
      {deletingRole && role && <DeleteRoleModal role={role} onClose={() => setDeletingRole(false)} />}
    </Card>
  );
};

export { RoleDetails };