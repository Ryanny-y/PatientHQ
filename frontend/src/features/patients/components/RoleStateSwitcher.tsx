import { type ReactElement } from 'react';
import { Button } from '@/components/ui/button';

interface RoleStateSwitcherProps {
  role: 'Admin' | 'Doctor' | 'Nurse';
  onRoleChange: (role: 'Admin' | 'Doctor' | 'Nurse') => void;
}

const RoleStateSwitcher = ({ role, onRoleChange }: RoleStateSwitcherProps): ReactElement => (
  <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">System access mode</p>
        <h2 className="mt-2 text-lg font-semibold text-slate-900">Mock RBAC role</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {(['Admin', 'Doctor', 'Nurse'] as const).map((option) => (
          <Button
            key={option}
            size="sm"
            variant={role === option ? 'default' : 'outline'}
            onClick={() => onRoleChange(option)}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  </div>
);

export default RoleStateSwitcher;
