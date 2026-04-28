import type { ReactElement } from "react";
import type { addPatientFormValues } from "../../types/patient";
import { ShieldCheck } from "lucide-react";
import { formatPhone } from "../../utils/patientUtils";

export const PatientSummaryCard = ({
  values,
  age,
}: {
  values: addPatientFormValues;
  age: number | null;
}): ReactElement => (
  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex items-center gap-3 mb-5">
      <div className="h-11 w-11 rounded-2xl bg-blue-600 text-white grid place-items-center">
        <ShieldCheck className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900">
          Registration Summary
        </p>
        <p className="text-xs text-slate-500">
          Review the patient profile before finalizing.
        </p>
      </div>
    </div>

    <div className="space-y-4">
      <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
        All patient data is protected under system access controls.
      </div>

      <div className="space-y-3">
        <SummaryRow
          label="Full Name"
          value={values.fullName || "No name yet"}
        />
        <SummaryRow
          label="Age"
          value={age !== null ? `${age} years` : "Awaiting birth date"}
        />
        <SummaryRow label="Gender" value={values.gender || "Awaiting gender"} />
        <SummaryRow
          label="Blood Type"
          value={values.bloodType || "Not selected"}
        />
        <SummaryRow
          label="Contact"
          value={
            values.contactNumber
              ? formatPhone(values.contactNumber)
              : "Not provided"
          }
        />
        <SummaryRow
          label="Emergency Contact"
          value={
            values.emergencyContactName
              ? `${values.emergencyContactName}${values.relationship ? ` · ${values.relationship}` : ""}`
              : "Not provided"
          }
        />
        <SummaryRow label="Status" value={values.status} />
      </div>
    </div>
  </div>
);

const SummaryRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}): ReactElement => (
  <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
    <span className="text-slate-500">{label}</span>
    <span className="font-semibold text-slate-900">{value}</span>
  </div>
);