
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { formSchema, FormValues } from "./schema";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { WorkInfoSection } from "./WorkInfoSection";
import { SenioritySection } from "./SenioritySection";
import { NotificationPreferences } from "./NotificationPreferences";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import { User } from "@/types";

interface WorkerFormProps {
  worker?: User;
  onSubmit: (data: FormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function WorkerForm({ worker, onSubmit, onCancel, isSubmitting = false }: WorkerFormProps) {
  const [localIsSubmitting, setLocalIsSubmitting] = useState(false);
  const effectiveIsSubmitting = isSubmitting || localIsSubmitting;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: worker?.name || "",
      email: worker?.email || "",
      department: worker?.department || "",
      shift: worker?.shift || "",
      workday: worker?.workday || "",
      seniorityYears: Math.floor((worker?.seniority || 0) / 365) || 0,
      seniorityMonths: Math.floor(((worker?.seniority || 0) % 365) / 30) || 0,
      seniorityDays: ((worker?.seniority || 0) % 365) % 30 || 0,
      notificationChannels: [
        { channel: "web", enabled: false },
        { channel: "email", enabled: false, contactValue: worker?.email || "" },
        { channel: "whatsapp", enabled: false }
      ],
      consentNotifications: false,
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setLocalIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setLocalIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <PersonalInfoSection form={form} isSubmitting={effectiveIsSubmitting} />
        <WorkInfoSection form={form} isSubmitting={effectiveIsSubmitting} />
        <SenioritySection form={form} isSubmitting={effectiveIsSubmitting} />
        <NotificationPreferences form={form} isSubmitting={effectiveIsSubmitting} />
        
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={effectiveIsSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={effectiveIsSubmitting}>
            {worker ? "Guardar cambios" : "Crear trabajador"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
