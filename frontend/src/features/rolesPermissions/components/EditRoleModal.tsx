import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useRolesMutation } from '../hooks/useRolesMutations.ts';
import type { Role } from '../types/roles.ts';

interface EditRoleModalProps {
  role: Role;
  onClose: () => void;
}

const EditRoleModal = ({ role, onClose }: EditRoleModalProps) => {
  const [name, setName] = useState(role.roleName);
  const [error, setError] = useState('');
  const { updateRole } = useRolesMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Role name is required');
      return;
    }
    try {
      await updateRole.mutateAsync({ id: role.id, updates: { roleName: name.toUpperCase() } });
      onClose();
    } catch (err) {
      setError('Failed to update role');
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Role Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateRole.isPending}>
              {updateRole.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { EditRoleModal };