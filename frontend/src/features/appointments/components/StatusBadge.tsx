import { Badge } from "@/components/ui/badge";
import { type ReactElement } from "react";

interface StatusBadgeProps {
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW' | string;
}

export const StatusBadge = ({ status }: StatusBadgeProps): ReactElement => {
  const variants = {
    PENDING: "bg-amber-100 text-amber-800 hover:bg-amber-100",
    CONFIRMED: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    COMPLETED: "bg-green-100 text-green-800 hover:bg-green-100",
    CANCELLED: "bg-red-100 text-red-800 hover:bg-red-100",
    NO_SHOW: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  };

  return (
    <Badge variant="secondary" className={variants[status as keyof typeof variants] || variants.PENDING}>
      {status === 'NO_SHOW' ? 'No Show' : status}
    </Badge>
  );
};
