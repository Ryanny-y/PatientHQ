import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePermissions } from '../hooks/usePermissions';
import { useRolePermissions } from '../hooks/useRolePermissions';
import { AssignPermissionsModal } from './AssignPermissionsModal';
import type { PermissionWithStatus } from '../types/roles';

interface PermissionsTableProps {
  roleId: string;
}

const PermissionsTable = ({ roleId }: PermissionsTableProps) => {
  const { permissions: allPermissions, isLoading: permissionsLoading } = usePermissions();
  const { data: rolePermissionsResponse, isLoading: rolePermissionsLoading } = useRolePermissions(roleId);
  const { updateRolePermissionsMutation } = usePermissions();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'assigned' | 'unassigned'>('all');
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Create a map of assigned permissions for quick lookup
  const assignedPermissionIds = new Set(
    rolePermissionsResponse?.data?.map(p => p.id) ?? []
  );

  // Merge all permissions with their assigned status
  const permissionsWithStatus: PermissionWithStatus[] = allPermissions.map(permission => ({
    ...permission,
    assigned: assignedPermissionIds.has(permission.id),
  }));

  const filteredPermissions = permissionsWithStatus.filter(p => {
    const matchesSearch = p.permissionName.toLowerCase().includes(search.toLowerCase()) ||
                         p.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' ||
                         (filter === 'assigned' && p.assigned) ||
                         (filter === 'unassigned' && !p.assigned);
    return matchesSearch && matchesFilter;
  });

  const handleTogglePermission = (permissionId: string, assigned: boolean) => {
    const currentAssigned = permissionsWithStatus.filter(p => p.assigned).map(p => p.id);
    let newAssigned;
    if (assigned) {
      newAssigned = currentAssigned.filter(id => id !== permissionId);
    } else {
      newAssigned = [...currentAssigned, permissionId];
    }
    console.log(newAssigned);
    
    updateRolePermissionsMutation.mutate({ roleId, permissionIds: newAssigned });
  };

  if (permissionsLoading || rolePermissionsLoading) {
    return <div>Loading permissions...</div>;
  }

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Search permissions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Select value={filter} onValueChange={(value: 'all' | 'assigned' | 'unassigned') => setFilter(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="unassigned">Not Assigned</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => setShowAssignModal(true)}>+ Assign Permission</Button>
      </div>
      {filteredPermissions.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No permissions found.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Permission Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPermissions.map((permission) => (
              <TableRow key={permission.id}>
                 <TableCell className="font-medium">{permission.permissionName}</TableCell>
                <TableCell>{permission.description}</TableCell>
                <TableCell>
                  <Badge variant={permission.assigned ? 'default' : 'secondary'}>
                    {permission.assigned ? 'Assigned' : 'Not Assigned'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant={permission.assigned ? 'destructive' : 'default'}
                    size="sm"
                    onClick={() => handleTogglePermission(permission.id, permission.assigned)}
                  >
                    {permission.assigned ? 'Remove' : 'Assign'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {showAssignModal && <AssignPermissionsModal roleId={roleId} onClose={() => setShowAssignModal(false)} />}
    </div>
  );
};

export { PermissionsTable };