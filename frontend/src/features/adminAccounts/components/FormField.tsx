import { type ReactElement, type ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/shared/utils/cn';

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export const FormField = ({ label, error, required, children, className }: FormFieldProps): ReactElement => (
  <div className={cn('space-y-1.5', className)}>
    <Label className={cn(required && "after:content-['*'] after:ml-0.5 after:text-red-500")}>
      {label}
    </Label>
    {children}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);
