import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { usePermissionsQuery } from '../hooks/usePermissionsQuery';
import { useRolePermissions } from '../hooks/useRolePermissions';
import { usePermissionMutation } from '../hooks/usePermissionMutations';

interface AssignPermissionsModalProps {
  roleId: string;
  onClose: () => void;
}

const AssignPermissionsModal = ({ roleId, onClose }: AssignPermissionsModalProps) => {
  const { data: allPermissionsResponse } = usePermissionsQuery();
  const allPermissions = allPermissionsResponse?.data ?? [];
  const { data: rolePermissionsResponse } = useRolePermissions(roleId);
  const rolePermissions = rolePermissionsResponse?.data ?? [];
  const { updateRolePermissions: updateMutation } = usePermissionMutation();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (rolePermissions) {
      setSelectedIds(rolePermissions.filter(p => p.assigned).map(p => p.id));
    }
  }, [rolePermissions]);

  const handleSubmit = async () => {
    try {
      await updateMutation.mutateAsync({ roleId, permissionIds: selectedIds });
      onClose();
    } catch (err) {
      alert('Failed to update permissions');
    }
  };

  const togglePermission = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Permissions</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {allPermissions?.map(permission => (
            <div key={permission.id} className="flex items-center space-x-2">
              <Checkbox
                id={permission.id}
                checked={selectedIds.includes(permission.id)}
                onCheckedChange={() => togglePermission(permission.id)}
              />
               <label htmlFor={permission.id} className="text-sm">
                 <div className="font-medium">{permission.permissionName}</div>
                 <div className="text-gray-500">{permission.description}</div>
               </label>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Saving...' : 'Save Assignments'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { AssignPermissionsModal };