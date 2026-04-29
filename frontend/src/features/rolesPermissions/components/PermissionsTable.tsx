import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRolePermissions } from '../hooks/useRolePermissions';
import { useUpdateRolePermissions } from '../hooks/usePermissionMutations';
import { AssignPermissionsModal } from './AssignPermissionsModal';

interface PermissionsTableProps {
  roleId: string;
}

const PermissionsTable = ({ roleId }: PermissionsTableProps) => {
  const { data: permissions, isLoading } = useRolePermissions(roleId);
  const updateMutation = useUpdateRolePermissions();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'assigned' | 'unassigned'>('all');
  const [showAssignModal, setShowAssignModal] = useState(false);

  const filteredPermissions = permissions?.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                         p.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' ||
                         (filter === 'assigned' && p.assigned) ||
                         (filter === 'unassigned' && !p.assigned);
    return matchesSearch && matchesFilter;
  }) || [];

  const handleTogglePermission = (permissionId: string, assigned: boolean) => {
    const currentAssigned = permissions?.filter(p => p.assigned).map(p => p.id) || [];
    let newAssigned;
    if (assigned) {
      newAssigned = currentAssigned.filter(id => id !== permissionId);
    } else {
      newAssigned = [...currentAssigned, permissionId];
    }
    updateMutation.mutate({ roleId, permissionIds: newAssigned });
  };

  if (isLoading) {
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
        <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
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
                <TableCell className="font-medium">{permission.name}</TableCell>
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