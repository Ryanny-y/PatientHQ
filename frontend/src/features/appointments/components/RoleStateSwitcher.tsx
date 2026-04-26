import { Button } from "@/components/ui/button";
import { type ReactElement } from "react";
import type { UserRole } from "../types/appointment";

interface RoleStateSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const RoleStateSwitcher = ({ currentRole, onRoleChange }: RoleStateSwitcherProps): ReactElement => {
  const roles: UserRole[] = ['admin', 'doctor', 'nurse'];

  return (
    <div className="flex items-center gap-2 mb-4 p-3 bg-slate-50 rounded-lg">
      <span className="text-sm font-medium text-slate-700">Test Role:</span>
      <div className="flex gap-1">
        {roles.map((role) => (
          <Button
            key={role}
            variant={currentRole === role ? "default" : "outline"}
            size="sm"
            onClick={() => onRoleChange(role)}
            className="capitalize"
          >
            {role}
          </Button>
        ))}
      </div>
    </div>
  );
};