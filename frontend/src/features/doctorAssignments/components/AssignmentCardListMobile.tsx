import { type ReactElement } from "react";
import { Clock, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import type { DoctorAssignment } from "@/features/doctorAssignments/types/assignment";

interface AssignmentCardListMobileProps {
  assignments: DoctorAssignment[];
  role: "Admin" | "Doctor" | "Nurse";
  onViewAssignment: (assignment: DoctorAssignment) => void;
  onReassignAssignment: (assignment: DoctorAssignment) => void;
  onRemoveAssignment: (assignment: DoctorAssignment) => void;
}

const AssignmentCardListMobile = ({
  assignments,
  role,
  onViewAssignment,
  onReassignAssignment,
  onRemoveAssignment,
}: AssignmentCardListMobileProps): ReactElement => (
  <div className="space-y-4">
    {assignments.map((assignment) => (
      <article
        key={assignment.assignmentId}
        className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">
              {assignment.patientName}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Assigned to {assignment.doctorName}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewAssignment(assignment)}>
                View Assignment
              </DropdownMenuItem>
              {role === "Admin" && (
                <DropdownMenuItem
                  onClick={() => onReassignAssignment(assignment)}
                >
                  Reassign Doctor
                </DropdownMenuItem>
              )}
              {role === "Admin" && (
                <DropdownMenuItem
                  onClick={() => onRemoveAssignment(assignment)}
                >
                  Remove Assignment
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-4 grid gap-3 text-sm text-slate-600">
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-3 py-2">
            <span className="font-semibold text-slate-900">Status</span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${assignment.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}`}
            >
              {assignment.isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-3 py-2">
            <span className="font-semibold text-slate-900">Date</span>
            <span className="inline-flex items-center gap-1 text-slate-500">
              <Clock className="h-3.5 w-3.5" />{" "}
              {new Date(assignment.assignedDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </article>
    ))}
  </div>
);

export default AssignmentCardListMobile;
