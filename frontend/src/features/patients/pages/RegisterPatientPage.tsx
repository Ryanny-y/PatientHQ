import { useEffect, useMemo, useState, type ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/shared/utils/cn";
import { usePatients } from "../hooks/usePatients";
import { addPatientSchema, type addPatientFormValues } from "../types/patient";
import { toast } from "sonner";
import { PatientSummaryCard } from "../components/register/PatientSummaryCard";
import { StickyActionBar } from "../components/register/StickyActionBar";
import { calculateAge, formatPhone } from "../utils/patientUtils";

const patientDraftKey = "patient_registration_draft";

const FormField = ({
  label,
  helper,
  error,
  required,
  children,
  className,
}: {
  label: string;
  helper?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}): ReactElement => (
  <div className={cn("space-y-2", className)}>
    <div className="flex items-baseline justify-between gap-3">
      <Label
        className={cn(
          required && "after:content-['*'] after:ml-0.5 after:text-red-500",
        )}
      >
        {label}
      </Label>
      {helper && <p className="text-xs text-slate-400">{helper}</p>}
    </div>
    {children}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

const SectionCard = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}): ReactElement => (
  <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        {title}
      </p>
      <h2 className="mt-3 text-xl font-semibold text-slate-900">
        {description}
      </h2>
    </div>
    <div className="space-y-6">{children}</div>
  </section>
);

const Textarea = ({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>): ReactElement => (
  <textarea
    className={cn(
      "min-h-24 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
      className,
    )}
    {...props}
  />
);

Textarea.displayName = "Textarea";


const RegisterPatientPage = (): ReactElement => {
  const navigate = useNavigate();
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createPatient } = usePatients();

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isDirty },
    getValues,
  } = useForm<addPatientFormValues>({
    resolver: zodResolver(addPatientSchema),
    defaultValues: {
      fullName: "",
      dateOfBirth: "",
      gender: "MALE",
      contactNumber: "",
      email: "",
      address: "",
      bloodType: "",
      allergies: "",
      existingConditions: "",
      notes: "",
      emergencyContactName: "",
      relationship: "",
      emergencyContactNumber: "",
      status: "ACTIVE",
    },
    mode: "onTouched",
  });

  useEffect(() => {
    const draft = window.localStorage.getItem(patientDraftKey);
    if (draft) {
      try {
        reset(JSON.parse(draft));
      } catch {
        window.localStorage.removeItem(patientDraftKey);
      }
    }
  }, [reset]);

  useEffect(() => {
    const subscription = watch((value) => {
      window.localStorage.setItem(patientDraftKey, JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const values = watch();
  const age = useMemo(
    () => calculateAge(values.dateOfBirth),
    [values.dateOfBirth],
  );
  const createdAt = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const handleSaveDraft = (): void => {
    setIsSavingDraft(true);
    window.localStorage.setItem(patientDraftKey, JSON.stringify(getValues()));
    toast.success("Patient intake draft saved.");
    setTimeout(() => setIsSavingDraft(false), 300);
  };

  const handleCancel = (): void => {
    if (
      isDirty &&
      !window.confirm(
        "You have unsaved changes. Discard and return to the patient list?",
      )
    ) {
      return;
    }
    navigate("/patients");
  };

  const onSubmit = async (formValues: addPatientFormValues): Promise<void> => {
    setIsSubmitting(true);
    try {
      const res = await createPatient(formValues);
      if (res.success) {
        toast.success("Patient registered successfully.");
        window.localStorage.removeItem(patientDraftKey);
        setTimeout(() => {
          navigate("patients");
        }, 900);
      } else {
        toast.error(
          res.message || "Failed to register patient. Please try again.",
        );
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative pb-24 lg:pb-0">
      <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Register Patient
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Register Patient
          </h1>
          <p className="max-w-2xl text-sm text-slate-500">
            Create a new patient profile and securely add personal medical
            details.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={handleCancel}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Patient List
          </Button>
          <Button
            variant="secondary"
            onClick={handleSaveDraft}
            disabled={isSavingDraft}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
        </div>
      </div>

      <form
        id="register-patient-form"
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]"
      >
        <div className="space-y-6">
          <SectionCard
            title="Intake Information"
            description="Personal Information"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                label="Full Name"
                error={errors.fullName?.message}
                required
              >
                <Input
                  placeholder="e.g. Juan Dela Cruz"
                  {...register("fullName")}
                />
              </FormField>
              <FormField
                label="Date of Birth"
                error={errors.dateOfBirth?.message}
                required
                helper={
                  age !== null
                    ? `${age} years old`
                    : "Select the patient birth date"
                }
              >
                <Input type="date" {...register("dateOfBirth")} />
              </FormField>
              <FormField label="Gender" error={errors.gender?.message} required>
                <Controller
                  control={control}
                  name="gender"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
              <FormField
                label="Contact Number"
                error={errors.contactNumber?.message}
                required
                helper="Format: 0917 123 4567"
              >
                <Input
                  placeholder="0917 123 4567"
                  {...register("contactNumber", {
                    onChange: (event) => {
                      event.target.value = formatPhone(event.target.value);
                    },
                  })}
                />
              </FormField>
              <FormField label="Email" error={errors.email?.message}>
                <Input
                  type="email"
                  placeholder="patient@example.com"
                  {...register("email")}
                />
              </FormField>
              <div className="md:col-span-2">
                <FormField
                  label="Address"
                  error={errors.address?.message}
                  required
                >
                  <Input
                    placeholder="Quezon City, Philippines"
                    {...register("address")}
                  />
                </FormField>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Medical Profile"
            description="Medical Information"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Blood Type">
                <Controller
                  control={control}
                  name="bloodType"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood type" />
                      </SelectTrigger>
                      <SelectContent>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                          (type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
              <FormField label="Allergies">
                <Textarea
                  placeholder="List known allergies"
                  {...register("allergies")}
                />
              </FormField>
              <div className="md:col-span-2">
                <FormField
                  label="Existing Conditions"
                  helper="Optional, for care team context"
                >
                  <Textarea
                    placeholder="e.g. asthma, hypertension"
                    {...register("existingConditions")}
                  />
                </FormField>
              </div>
              <div className="md:col-span-2">
                <FormField label="Notes">
                  <Textarea
                    placeholder="Add any additional intake notes"
                    {...register("notes")}
                  />
                </FormField>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Emergency Contact"
            description="Emergency Contact"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                label="Contact Name"
                error={errors.emergencyContactName?.message}
                required
              >
                <Input
                  placeholder="e.g. Maria Dela Cruz"
                  {...register("emergencyContactName")}
                />
              </FormField>
              <FormField label="Relationship">
                <Input
                  placeholder="e.g. Mother, Brother"
                  {...register("relationship")}
                />
              </FormField>
              <FormField
                label="Contact Number"
                error={errors.emergencyContactNumber?.message}
                required
                helper="Format: 0917 123 4567"
              >
                <Input
                  placeholder="0917 123 4567"
                  {...register("emergencyContactNumber", {
                    onChange: (event) => {
                      event.target.value = formatPhone(event.target.value);
                    },
                  })}
                />
              </FormField>
            </div>
          </SectionCard>

          <SectionCard
            title="Registration Complete"
            description="Status & System Info"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Status">
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                        <SelectItem value="ADMITTED">ADMITTED</SelectItem>
                        <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
              <div className="grid gap-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Patient ID
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    Auto-generated on submit
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Created At
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {createdAt}
                  </p>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="lg:sticky lg:top-6">
          <PatientSummaryCard values={values} age={age} />
        </div>
      </form>

      <div className="mt-4 block lg:hidden" />
      <StickyActionBar
        onCancel={handleCancel}
        onSaveDraft={handleSaveDraft}
        submitting={isSubmitting}
      />
    </div>
  );
};

export default RegisterPatientPage;
