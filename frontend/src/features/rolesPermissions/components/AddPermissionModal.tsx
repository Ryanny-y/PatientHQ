import { useState, type SubmitEvent } from 'react';
import { usePermissionMutation } from '../hooks/usePermissionMutations';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { DialogDescription } from '@radix-ui/react-dialog';

interface AddPermissionModalProps {
  onClose: () => void;
}

const AddPermissionModal = ({ onClose }: AddPermissionModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const { createPermission: createMutation } = usePermissionMutation();

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Permission name is required');
      return;
    }
    try {
      await createMutation.mutateAsync({
        permissionName: name.toUpperCase(),
        description,
      });
      onClose();
    } catch (err) {
      setError('Failed to create permission');
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="px-6">
        <DialogHeader className='pl-0'>
          <DialogTitle>Add New Permission</DialogTitle>
          <DialogDescription className='text-sm'>Add a new permission to the system.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Permission Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., VIEW_PATIENTS, MANAGE_DOCTORS"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this permission allows"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Permission'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { AddPermissionModal };