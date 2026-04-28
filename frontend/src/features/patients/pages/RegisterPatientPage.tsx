import { useEffect, useMemo, useState, type ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2, Save, ShieldCheck, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast, ToastContainer } from '@/shared/hooks/useToast';
import { cn } from '@/shared/utils/cn';

const patientDraftKey = 'patient_registration_draft';

const formSchema = z.object({
  full_name: z.string().min(3, 'Full name must be at least 3 characters'),
  date_of_birth: z.string().refine((value) => {
    const date = new Date(value);
    const now = new Date();
    const earliest = new Date(now.getFullYear() - 120, now.getMonth(), now.getDate());
    return value !== '' && date <= now && date >= earliest;
  }, { message: 'Enter a valid date of birth' }),
  gender: z.enum(['Male', 'Female', 'Prefer not to say'] as const),
  contact_number: z.string().transform((value) => value.replace(/\D/g, '')).refine((value) => value.length === 11, { message: 'Enter an 11-digit contact number' }),
  email: z.string().email('Enter a valid email address').or(z.literal('')),
  address: z.string().min(5, 'Address is required'),
  blood_type: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''] as const).optional(),
  allergies: z.string().optional(),
  existing_conditions: z.string().optional(),
  notes: z.string().optional(),
  emergency_contact_name: z.string().min(3, 'Emergency contact name is required'),
  relationship: z.string().optional(),
  emergency_contact_number: z.string().transform((value) => value.replace(/\D/g, '')).refine((value) => value.length === 11, { message: 'Enter an 11-digit emergency number' }),
  status: z.enum(['ACTIVE', 'ADMITTED', 'INACTIVE']),
});

type RegisterPatientFormValues = z.infer<typeof formSchema>;

const formatPhone = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 4) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
};

const calculateAge = (value: string): number | null => {
  if (!value) return null;
  const dob = new Date(value);
  if (!(dob instanceof Date) || Number.isNaN(dob.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDelta = today.getMonth() - dob.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < dob.getDate())) {
    age -= 1;
  }
  return age >= 0 ? age : null;
};

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
  <div className={cn('space-y-2', className)}>
    <div className="flex items-baseline justify-between gap-3">
      <Label className={cn(required && "after:content-['*'] after:ml-0.5 after:text-red-500")}>{label}</Label>
      {helper && <p className="text-xs text-slate-400">{helper}</p>}
    </div>
    {children}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

const SectionCard = ({ title, description, children }: { title: string; description: string; children: React.ReactNode }): ReactElement => (
  <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{title}</p>
      <h2 className="mt-3 text-xl font-semibold text-slate-900">{description}</h2>
    </div>
    <div className="space-y-6">{children}</div>
  </section>
);

const PatientSummaryCard = ({ values, age }: { values: RegisterPatientFormValues; age: number | null }): ReactElement => (
  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex items-center gap-3 mb-5">
      <div className="h-11 w-11 rounded-2xl bg-blue-600 text-white grid place-items-center">
        <ShieldCheck className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900">Registration Summary</p>
        <p className="text-xs text-slate-500">Review the patient profile before finalizing.</p>
      </div>
    </div>

    <div className="space-y-4">
      <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
        All patient data is protected under system access controls.
      </div>

      <div className="space-y-3">
        <SummaryRow label="Full Name" value={values.full_name || 'No name yet'} />
        <SummaryRow label="Age" value={age !== null ? `${age} years` : 'Awaiting birth date'} />
        <SummaryRow label="Gender" value={values.gender || 'Awaiting gender'} />
        <SummaryRow label="Blood Type" value={values.blood_type || 'Not selected'} />
        <SummaryRow label="Contact" value={values.contact_number ? formatPhone(values.contact_number) : 'Not provided'} />
        <SummaryRow label="Emergency Contact" value={values.emergency_contact_name ? `${values.emergency_contact_name}${values.relationship ? ` · ${values.relationship}` : ''}` : 'Not provided'} />
        <SummaryRow label="Status" value={values.status} />
      </div>
    </div>
  </div>
);

const SummaryRow = ({ label, value }: { label: string; value: string }): ReactElement => (
  <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
    <span className="text-slate-500">{label}</span>
    <span className="font-semibold text-slate-900">{value}</span>
  </div>
);

const Textarea = ({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>): ReactElement => (
  <textarea
    className={cn(
      'min-h-24 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
      className
    )}
    {...props}
  />
);

Textarea.displayName = 'Textarea';

const StickyActionBar = ({ onCancel, onSaveDraft, submitting }: { onCancel: () => void; onSaveDraft: () => void; submitting: boolean }): ReactElement => (
  <div className="lg:static fixed inset-x-0 bottom-0 z-20 bg-white border-t border-slate-200 px-4 py-3 shadow-[0_-8px_30px_-24px_rgba(15,23,42,0.15)] lg:shadow-none lg:px-0">
    <div className="mx-auto flex max-w-7xl flex-col gap-3 lg:flex-row lg:justify-end lg:items-center">
      <div className="flex flex-1 items-center gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="button" variant="secondary" onClick={onSaveDraft}>Save Draft</Button>
      </div>
      <Button type="submit" form="register-patient-form" className="ml-auto" disabled={submitting}>
        {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
        Register Patient
      </Button>
    </div>
  </div>
);

const RegisterPatientPage = (): ReactElement => {
  const navigate = useNavigate();
  const { toast, toasts, dismiss } = useToast();
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isDirty },
    getValues,
  } = useForm<RegisterPatientFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: '',
      date_of_birth: '',
      gender: 'Prefer not to say',
      contact_number: '',
      email: '',
      address: '',
      blood_type: '',
      allergies: '',
      existing_conditions: '',
      notes: '',
      emergency_contact_name: '',
      relationship: '',
      emergency_contact_number: '',
      status: 'ACTIVE',
    },
    mode: 'onTouched',
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
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const values = watch();
  const age = useMemo(() => calculateAge(values.date_of_birth), [values.date_of_birth]);
  const createdAt = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const handleSaveDraft = (): void => {
    setIsSavingDraft(true);
    window.localStorage.setItem(patientDraftKey, JSON.stringify(getValues()));
    toast('Patient intake draft saved.');
    setTimeout(() => setIsSavingDraft(false), 300);
  };

  const handleCancel = (): void => {
    if (isDirty && !window.confirm('You have unsaved changes. Discard and return to the patient list?')) {
      return;
    }
    navigate('patients');
  };

  const onSubmit = async (formValues: RegisterPatientFormValues): Promise<void> => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    const savedPatient = {
      patient_id: 1050,
      full_name: formValues.full_name,
      date_of_birth: formValues.date_of_birth,
      gender: formValues.gender,
      contact_number: formValues.contact_number,
      email: formValues.email,
      address: formValues.address,
      blood_type: formValues.blood_type,
      allergies: formValues.allergies,
      emergency_contact_name: formValues.emergency_contact_name,
      emergency_contact_number: formValues.emergency_contact_number,
      status: formValues.status,
      created_at: createdAt,
    };

    window.localStorage.removeItem(patientDraftKey);
    toast('Patient registered successfully.');
    setTimeout(() => {
      navigate('patients');
    }, 900);
    setIsSubmitting(false);
    console.log('Registered patient:', savedPatient);
  };

  return (
    <div className="relative pb-24 lg:pb-0">
      <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Register Patient</p>
          <h1 className="text-3xl font-semibold text-slate-900">Register Patient</h1>
          <p className="max-w-2xl text-sm text-slate-500">
            Create a new patient profile and securely add personal medical details.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={handleCancel}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Patient List
          </Button>
          <Button variant="secondary" onClick={handleSaveDraft} disabled={isSavingDraft}>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
        </div>
      </div>

      <form id="register-patient-form" onSubmit={handleSubmit(onSubmit)} className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
        <div className="space-y-6">
          <SectionCard title="Intake Information" description="Personal Information">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Full Name" error={errors.full_name?.message} required>
                <Input placeholder="e.g. Juan Dela Cruz" {...register('full_name')} />
              </FormField>
              <FormField label="Date of Birth" error={errors.date_of_birth?.message} required helper={age !== null ? `${age} years old` : 'Select the patient birth date'}>
                <Input type="date" {...register('date_of_birth')} />
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
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
              <FormField label="Contact Number" error={errors.contact_number?.message} required helper="Format: 0917 123 4567">
                <Input
                  placeholder="0917 123 4567"
                  {...register('contact_number', {
                    onChange: (event) => {
                      event.target.value = formatPhone(event.target.value);
                    },
                  })}
                />
              </FormField>
              <FormField label="Email" error={errors.email?.message}>
                <Input type="email" placeholder="patient@example.com" {...register('email')} />
              </FormField>
              <div className="md:col-span-2">
                <FormField label="Address" error={errors.address?.message} required>
                  <Input placeholder="Quezon City, Philippines" {...register('address')} />
                </FormField>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Medical Profile" description="Medical Information">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Blood Type">
                <Controller
                  control={control}
                  name="blood_type"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood type" />
                      </SelectTrigger>
                      <SelectContent>
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
              <FormField label="Allergies">
                <Textarea placeholder="List known allergies" {...register('allergies')} />
              </FormField>
              <div className="md:col-span-2">
                <FormField label="Existing Conditions" helper="Optional, for care team context">
                  <Textarea placeholder="e.g. asthma, hypertension" {...register('existing_conditions')} />
                </FormField>
              </div>
              <div className="md:col-span-2">
                <FormField label="Notes">
                  <Textarea placeholder="Add any additional intake notes" {...register('notes')} />
                </FormField>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Emergency Contact" description="Emergency Contact">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Contact Name" error={errors.emergency_contact_name?.message} required>
                <Input placeholder="e.g. Maria Dela Cruz" {...register('emergency_contact_name')} />
              </FormField>
              <FormField label="Relationship">
                <Input placeholder="e.g. Mother, Brother" {...register('relationship')} />
              </FormField>
              <FormField label="Contact Number" error={errors.emergency_contact_number?.message} required helper="Format: 0917 123 4567">
                <Input
                  placeholder="0917 123 4567"
                  {...register('emergency_contact_number', {
                    onChange: (event) => {
                      event.target.value = formatPhone(event.target.value);
                    },
                  })}
                />
              </FormField>
            </div>
          </SectionCard>

          <SectionCard title="Registration Complete" description="Status & System Info">
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
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Patient ID</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">Auto-generated on submit</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Created At</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{createdAt}</p>
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
      <ToastContainer toasts={toasts} dismiss={dismiss} />
      <StickyActionBar onCancel={handleCancel} onSaveDraft={handleSaveDraft} submitting={isSubmitting} />
    </div>
  );
};

export default RegisterPatientPage;
