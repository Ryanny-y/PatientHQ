import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { usePermissions } from '../hooks/usePermissions';
import type { Permission } from '../types/roles';

interface DeletePermissionModalProps {
  permission: Permission;
  onClose: () => void;
}

const DeletePermissionModal = ({ permission, onClose }: DeletePermissionModalProps) => {
  const { deletePermission, deletePermissionMutation } = usePermissions();

  const handleDelete = async () => {
    try {
      await deletePermission(permission.id);
      onClose();
    } catch (err) {
      alert('Failed to delete permission');
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="px-6">
        <DialogHeader className='pl-0'>
          <DialogTitle>Delete Permission</DialogTitle>
          <DialogDescription className='text-sm'>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>Are you sure you want to delete the permission "{permission.permissionName}"?</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deletePermissionMutation.isPending}>
            {deletePermissionMutation.isPending ? 'Deleting...' : 'Delete Permission'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { DeletePermissionModal };