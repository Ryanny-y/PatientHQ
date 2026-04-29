import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { usePermissions } from '../hooks/usePermissions';
import { AddPermissionModal } from './AddPermissionModal';
import type { Permission } from '../types/roles';
import { EditPermissionModal } from './EditPermissionModal';
import { DeletePermissionModal } from './DeletePermissionModal';

const PermissionsList = () => {
  const { permissions, isLoading } = usePermissions();
  const [search, setSearch] = useState('');
  const [showAddPermission, setShowAddPermission] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [deletingPermission, setDeletingPermission] = useState<Permission | null>(null);

  const filteredPermissions = permissions.filter((permission) => {
    const query = search.toLowerCase();
    return (
      permission.permissionName.toLowerCase().includes(query) ||
      permission.description.toLowerCase().includes(query)
    );
  });

  return (
    <Card className='max-h-150 overflow-y-auto pt-0'>
      <CardHeader className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sticky top-0 bg-white py-5 z-10">
        <div>
          <CardTitle>Permissions</CardTitle>
          <p className="text-sm text-gray-600">Manage all permissions available in the system.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search permissions..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full sm:w-72"
          />
          <Button onClick={() => setShowAddPermission(true)}>+ Add Permission</Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-10 text-gray-500">Loading permissions...</div>
        ) : filteredPermissions.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No permissions found.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Permission</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPermissions.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell className="font-medium">{permission.permissionName}</TableCell>
                  <TableCell>{permission.description}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Global</Badge>
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" variant="outline" onClick={() => setEditingPermission(permission)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => setDeletingPermission(permission)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      {showAddPermission && <AddPermissionModal onClose={() => setShowAddPermission(false)} />}
      {editingPermission && (
        <EditPermissionModal permission={editingPermission} onClose={() => setEditingPermission(null)} />
      )}
      {deletingPermission && (
        <DeletePermissionModal permission={deletingPermission} onClose={() => setDeletingPermission(null)} />
      )}
    </Card>
  );
};

export { PermissionsList };