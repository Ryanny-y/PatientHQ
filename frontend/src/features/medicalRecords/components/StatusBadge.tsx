import { Badge } from "@/components/ui/badge";
import { type ReactElement } from "react";

interface StatusBadgeProps {
  status: 'Active' | 'Inactive' | 'Discharged' | string;
}

export const StatusBadge = ({ status }: StatusBadgeProps): ReactElement => {
  const variants = {
    Active: "bg-green-100 text-green-800 hover:bg-green-100",
    Inactive: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    Discharged: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  };

  return (
    <Badge variant="secondary" className={variants[status as keyof typeof variants] || variants.Inactive}>
      {status}
    </Badge>
  );
};