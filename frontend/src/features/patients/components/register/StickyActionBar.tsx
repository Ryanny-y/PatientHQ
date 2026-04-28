import { Button } from "@/components/ui/button";
import { Loader2, UserPlus } from "lucide-react";

export const StickyActionBar = ({
  onCancel,
  onSaveDraft,
  submitting,
}: {
  onCancel: () => void;
  onSaveDraft: () => void;
  submitting: boolean;
}) => (
  <div className="lg:static fixed inset-x-0 bottom-0 z-20 bg-white border-t border-slate-200 px-4 py-3 shadow-[0_-8px_30px_-24px_rgba(15,23,42,0.15)] lg:shadow-none lg:px-0">
    <div className="mx-auto flex max-w-7xl flex-col gap-3 lg:flex-row lg:justify-end lg:items-center">
      <div className="flex flex-1 items-center gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" variant="secondary" onClick={onSaveDraft}>
          Save Draft
        </Button>
      </div>
      <Button
        type="submit"
        form="register-patient-form"
        className="ml-auto"
        disabled={submitting}
      >
        {submitting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <UserPlus className="mr-2 h-4 w-4" />
        )}
        Register Patient
      </Button>
    </div>
  </div>
);
