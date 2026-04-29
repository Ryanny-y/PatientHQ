import { useState, type SubmitEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Role } from "../types/roles";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useRoles } from "../hooks/useRoles";
import { DialogDescription } from "@radix-ui/react-dialog";

interface AddRoleModalProps {
  onClose: () => void;
  onRoleCreated: (role: Role) => void;
}

const AddRoleModal = ({ onClose, onRoleCreated }: AddRoleModalProps) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { createRole, createRoleMutation } = useRoles();

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Role name is required");
      return;
    }
    try {
      const newRole = await createRole({
        roleName: name.toUpperCase(),
      });
      onRoleCreated(newRole.data);
      onClose();
    } catch (err) {
      setError("Failed to create role");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
       <DialogContent className="px-6">
        <DialogHeader className="pl-0">
          <DialogTitle>Add New Role</DialogTitle>
          <DialogDescription className="text-sm">Add a new role to the system.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Role Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., ADMIN, DOCTOR"
                required
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createRoleMutation.isPending}>
              {createRoleMutation.isPending ? "Creating..." : "Create Role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { AddRoleModal };