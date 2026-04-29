import { useState, type SubmitEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { usePermissions } from '../hooks/usePermissions';
import type { Permission } from '../types/roles';

interface EditPermissionModalProps {
  permission: Permission;
  onClose: () => void;
}

const EditPermissionModal = ({ permission, onClose }: EditPermissionModalProps) => {
  const [name, setName] = useState(permission.permissionName);
  const [description, setDescription] = useState(permission.description);
  const [error, setError] = useState('');
  const { updatePermission, updatePermissionMutation } = usePermissions();

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) {
      setError('Permission name is required');
      return;
    }

    try {
      await updatePermission({
        id: permission.id,
        updates: {
          permissionName: name.toUpperCase(),
          description,
        },
      });
      onClose();
    } catch (err) {
      setError('Failed to update permission');
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="px-6">
        <DialogHeader className='pl-0'>
          <DialogTitle>Edit Permission</DialogTitle>
          <DialogDescription className='text-sm'>Update the permission name or description.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Permission Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={updatePermissionMutation.isPending}>
              {updatePermissionMutation.isPending ? 'Saving...' : 'Save Permission'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { EditPermissionModal };