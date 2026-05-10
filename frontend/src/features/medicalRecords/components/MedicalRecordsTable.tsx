import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Printer,
} from "lucide-react";
import { type ReactElement } from "react";
import type { MedicalRecord } from "../types/medicalRecord";
import { StatusBadge } from "./StatusBadge";

interface MedicalRecordsTableProps {
  records: MedicalRecord[];
  onViewRecord: (record: MedicalRecord) => void;
  onEditRecord: (record: MedicalRecord) => void;
  onPrintRecord: (record: MedicalRecord) => void;
  onArchiveRecord: (record: MedicalRecord) => void;
  canEditRecord?: boolean;
}

export const MedicalRecordsTable = ({
  records,
  onViewRecord,
  onEditRecord,
  onPrintRecord,
  canEditRecord = false,
}: MedicalRecordsTableProps): ReactElement => {
  const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50">
            <TableHead className="font-semibold text-slate-700">
              Record ID
            </TableHead>
            <TableHead className="font-semibold text-slate-700">
              Patient
            </TableHead>
            <TableHead className="font-semibold text-slate-700">
              Doctor
            </TableHead>
            <TableHead className="font-semibold text-slate-700">
              Diagnosis
            </TableHead>
            <TableHead className="font-semibold text-slate-700">
              Treatment Summary
            </TableHead>
            <TableHead className="font-semibold text-slate-700">
              Created
            </TableHead>
            <TableHead className="font-semibold text-slate-700">
              Status
            </TableHead>
            <TableHead className="font-semibold text-slate-700 w-17.5">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow
              key={record.recordId}
              className="hover:bg-slate-50/50 transition-colors"
            >
              <TableCell className="font-medium text-slate-900">
                #{record.recordId.slice(-8)}
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium text-slate-900">
                    {record.patientName || "Unknown Patient"}
                  </div>
                  <div className="text-sm text-slate-500">
                    ID: {record.patientId}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-slate-700">
                {record.doctorName || "Unknown Doctor"}
              </TableCell>
              <TableCell>
                <div title={record.diagnosis} className="max-w-50">
                  {truncateText(record.diagnosis)}
                </div>
              </TableCell>
              <TableCell>
                <div title={record.treatment} className="max-w-50">
                  {truncateText(record.treatment)}
                </div>
              </TableCell>
              <TableCell className="text-slate-600">
                <div>{new Date(record.createdAt).toLocaleDateString()}</div>
                {record.lastUpdated &&
                  record.lastUpdated !== record.createdAt && (
                    <div className="text-xs text-slate-400">
                      Updated:{" "}
                      {new Date(record.lastUpdated).toLocaleDateString()}
                    </div>
                  )}
              </TableCell>
              <TableCell>
                <StatusBadge status={record.patientStatus || "Active"} />
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => onViewRecord(record)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Record
                    </DropdownMenuItem>
                    {canEditRecord && (
                      <DropdownMenuItem onClick={() => onEditRecord(record)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Record
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => onPrintRecord(record)}>
                      <Printer className="mr-2 h-4 w-4" />
                      Print Summary
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {records.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No medical records found matching your criteria.
        </div>
      )}
    </div>
  );
};
