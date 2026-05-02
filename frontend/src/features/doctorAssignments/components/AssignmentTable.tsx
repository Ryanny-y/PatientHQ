import { type ReactElement } from "react";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DoctorAssignment } from "@/features/doctorAssignments/types/assignment";

interface AssignmentTableProps {
  assignments: DoctorAssignment[];
  role: "Admin" | "Doctor" | "Nurse";
  onViewAssignment: (assignment: DoctorAssignment) => void;
  onReassignAssignment: (assignment: DoctorAssignment) => void;
  onRemoveAssignment: (assignment: DoctorAssignment) => void;
  onViewPatient: (assignment: DoctorAssignment) => void;
  onViewDoctor: (assignment: DoctorAssignment) => void;
}

const statusClasses: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  ADMITTED: "bg-blue-100 text-blue-700",
  CRITICAL: "bg-red-100 text-red-700",
  INACTIVE: "bg-slate-100 text-slate-700",
  Active: "bg-emerald-100 text-emerald-700",
  Inactive: "bg-slate-100 text-slate-700",
};

const AssignmentTable = ({
  assignments,
  role,
  onViewAssignment,
  onReassignAssignment,
  onRemoveAssignment,
  onViewPatient,
  onViewDoctor,
}: AssignmentTableProps): ReactElement => (
  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
    <Table className="min-w-full">
      <TableHeader>
        <TableRow>
          <TableCell>Assignment ID</TableCell>
          <TableCell>Patient</TableCell>
          <TableCell>Patient Status</TableCell>
          <TableCell>Assigned Doctor</TableCell>
          <TableCell>Specialization</TableCell>
          <TableCell>Assigned Date</TableCell>
          <TableCell>Assignment Status</TableCell>
          <TableCell className="sticky right-0 bg-white">Actions</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assignments.map((assignment) => (
          <TableRow key={assignment.assignmentId}>
            <TableCell className="font-medium text-slate-900">
              {assignment.assignmentId.slice(0, 8).toUpperCase()}
            </TableCell>
            <TableCell>{assignment.patientName}</TableCell>
            <TableCell>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[assignment.patientStatus] ?? "bg-slate-100 text-slate-700"}`}
              >
                {assignment.patientStatus}
              </span>
            </TableCell>
            <TableCell>{assignment.doctorName}</TableCell>
            <TableCell>{assignment.doctorSpecialization}</TableCell>
            <TableCell>
              {new Date(assignment.assignedDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </TableCell>
            <TableCell>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[assignment.isActive ? "Active" : "Inactive"]}`}
              >
                {assignment.isActive ? "Active" : "Inactive"}
              </span>
            </TableCell>
            <TableCell className="sticky right-0 bg-white">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onViewAssignment(assignment)}
                  >
                    View Assignment
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onViewPatient(assignment)}>
                    View Patient Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onViewDoctor(assignment)}>
                    View Doctor Profile
                  </DropdownMenuItem>
                  {role === "Admin" && (
                    <>
                      <DropdownMenuItem
                        onClick={() => onReassignAssignment(assignment)}
                      >
                        Reassign Doctor
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onRemoveAssignment(assignment)}
                      >
                        Remove Assignment
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default AssignmentTable;
