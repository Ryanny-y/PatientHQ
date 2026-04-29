import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useRolesMutation } from '../hooks/useRolesMutations';
import type { Role } from '../types/roles';

interface DeleteRoleModalProps {
  role: Role;
  onClose: () => void;
}

const DeleteRoleModal = ({ role, onClose }: DeleteRoleModalProps) => {
  const { deleteRole } = useRolesMutation();

  const handleDelete = async () => {
    if (role.userCount > 0) {
      alert('This role cannot be deleted because users are assigned.');
      return;
    }
    try {
      await deleteRole.mutateAsync(role.id);
      onClose();
    } catch (err) {
      alert('Failed to delete role');
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Role</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Are you sure you want to delete the role "{role.roleName}"?</p>
          {role.userCount > 0 && (
            <p className="text-red-500 mt-2">
              This role cannot be deleted because {role.userCount} users are assigned to it.
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteRole.isPending || role.userCount > 0}
          >
            {deleteRole.isPending ? 'Deleting...' : 'Delete Role'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { DeleteRoleModal };