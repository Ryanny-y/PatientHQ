import { Button } from '@/components/ui/button';
import { type ReactElement } from 'react';
import type { UserRole } from '../types/report';

interface RoleStateSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const RoleStateSwitcher = ({ currentRole, onRoleChange }: RoleStateSwitcherProps): ReactElement => {
  const roles: UserRole[] = ['admin', 'doctor', 'nurse'];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
      <div className="text-sm font-medium text-slate-700">Mock Role</div>
      <div className="flex flex-wrap gap-2">
        {roles.map((role) => (
          <Button
            key={role}
            variant={currentRole === role ? 'default' : 'outline'}
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