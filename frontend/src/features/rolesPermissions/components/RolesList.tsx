import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useRoles } from '../hooks/useRoles';
import type { Role } from '../types/roles.ts';
import { EditRoleModal } from './EditRoleModal';
import { DeleteRoleModal } from './DeleteRoleModal';

interface RolesListProps {
  onSelectRole: (role: Role) => void;
}

const RolesList = ({ onSelectRole }: RolesListProps) => {
  const { roles, isLoading } = useRoles();
  const [search, setSearch] = useState('');
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);

  const filteredRoles = roles.filter(r =>
    r.roleName.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Roles</CardTitle>
          <Input placeholder="Search role..." disabled />
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading roles...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Roles</CardTitle>
        <Input
          placeholder="Search role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </CardHeader>
      <CardContent className="space-y-2">
        {filteredRoles.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No roles found. Create your first role.
          </div>
        ) : (
          filteredRoles.map((role) => (
            <div
              key={role.id}
              className="flex items-center justify-between p-4 border border-gray-400 rounded-lg cursor-pointer hover:bg-gray-50"
              onClick={() => onSelectRole(role)}
            >
               <div>
                 <h3 className="font-semibold">{role.roleName}</h3>
                <p className="text-sm text-gray-600">
                  {role.userCount} Users • {role.permissionCount} Permissions
                </p>
                <p className="text-xs text-gray-500">ID: {role.id}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">⋮</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => onSelectRole(role)}>View Details</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setEditingRole(role)}>Rename Role</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDeletingRole(role)} className="text-red-600">Delete Role</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))
        )}
      </CardContent>
      {editingRole && <EditRoleModal role={editingRole} onClose={() => setEditingRole(null)} />}
      {deletingRole && <DeleteRoleModal role={deletingRole} onClose={() => setDeletingRole(null)} />}
    </Card>
  );
};

export { RolesList };