import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { usePermissions } from '../hooks/usePermissions';
import { useRolePermissions } from '../hooks/useRolePermissions';

interface AssignPermissionsModalProps {
  roleId: string;
  onClose: () => void;
}

const AssignPermissionsModal = ({ roleId, onClose }: AssignPermissionsModalProps) => {
  const { permissions: allPermissions } = usePermissions();
  const { data: rolePermissionsResponse } = useRolePermissions(roleId); 
  const { updateRolePermissions, updateRolePermissionsMutation } = usePermissions();
  
  // Initialize selectedIds with currently assigned permissions
  const assignedPermissionIds = new Set(
    rolePermissionsResponse?.data?.map(p => p.id) ?? []
  );
  const [selectedIds, setSelectedIds] = useState<string[]>(Array.from(assignedPermissionIds));

  const handleSubmit = async () => {
    try {
      await updateRolePermissions({ roleId, permissionIds: selectedIds });
      onClose();
    } catch {
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
          <DialogDescription>Select permissions to assign to this role.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 max-h-96 overflow-y-auto px-5">
          {allPermissions?.map(permission => (
            <div key={permission.id} className="flex items-center space-x-2">
              <Checkbox
                id={permission.id}
                checked={selectedIds.includes(permission.id)}
                onCheckedChange={() => togglePermission(permission.id)}
              />
               <label htmlFor={permission.id} className="text-sm">
                 <div className="font-medium">{permission.permissionName}</div>
                 <div className="text-gray-500 text-sm">{permission.description}</div>
               </label>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={updateRolePermissionsMutation.isPending}>
            {updateRolePermissionsMutation.isPending ? 'Saving...' : 'Save Assignments'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { AssignPermissionsModal };