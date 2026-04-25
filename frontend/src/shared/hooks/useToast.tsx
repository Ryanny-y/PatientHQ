import { useState, useCallback, type ReactElement } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

export type toastVariant = 'success' | 'error' | 'warning';

interface Toast {
  id: string;
  message: string;
  variant: toastVariant;
}

interface useToastReturn {
  toasts: Toast[];
  toast: (message: string, variant?: toastVariant) => void;
  dismiss: (id: string) => void;
}

export const useToast = (): useToastReturn => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, variant: toastVariant = 'success'): void => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const dismiss = useCallback((id: string): void => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, toast, dismiss };
};

const icons: Record<toastVariant, ReactElement> = {
  success: <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />,
  error: <XCircle className="h-4 w-4 text-red-500 shrink-0" />,
  warning: <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />,
};

const styles: Record<toastVariant, string> = {
  success: 'border-emerald-200 bg-emerald-50',
  error: 'border-red-200 bg-red-50',
  warning: 'border-amber-200 bg-amber-50',
};

interface ToastContainerProps {
  toasts: Toast[];
  dismiss: (id: string) => void;
}

export const ToastContainer = ({ toasts, dismiss }: ToastContainerProps): ReactElement => (
  <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
    {toasts.map((t) => (
      <div
        key={t.id}
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium text-slate-800 pointer-events-auto min-w-[280px] max-w-sm animate-in slide-in-from-right-5 fade-in-0',
          styles[t.variant]
        )}
      >
        {icons[t.variant]}
        <span className="flex-1">{t.message}</span>
        <button onClick={() => dismiss(t.id)} className="text-slate-400 hover:text-slate-600 transition-colors">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    ))}
  </div>
);
