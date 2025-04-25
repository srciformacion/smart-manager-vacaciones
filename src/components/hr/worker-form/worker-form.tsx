
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { User, Department, ShiftType, WorkdayType } from "@/types";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formSchema, FormValues } from "./schema";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { WorkInfoSection } from "./WorkInfoSection";
import { SenioritySection } from "./SenioritySection";
import { NotificationPreferences } from "./NotificationPreferences";

interface WorkerFormProps {
  worker?: User;
  onSubmit: (data: FormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

// Define the arrays with the correct types
const departments: Department[] = [
  "Recursos Humanos",
  "Atención al cliente", 
  "Operaciones", 
  "Administración", 
  "Personal de movimiento"
];

const shifts: ShiftType[] = [
  "Programado",
  "Urgente 24h", 
  "Localizado"
];

const workdayTypes: WorkdayType[] = [
  "Completa", 
  "Parcial", 
  "Reducida"
];

export function WorkerForm({ worker, onSubmit, onCancel, isSubmitting }: WorkerFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: worker?.name || "",
      email: worker?.email || "",
      department: worker?.department || "",
      shift: worker?.shift || "",
      workday: worker?.workday || "",
      seniorityYears: Math.floor(worker?.seniority || 0),
      seniorityMonths: Math.floor((worker?.seniority || 0) % 1 * 12),
      seniorityDays: Math.floor((worker?.seniority || 0) % (1/12) * 30),
      notificationChannels: [
        { channel: "web", enabled: false },
        { channel: "email", enabled: false },
        { channel: "whatsapp", enabled: false }
      ],
      consentNotifications: false,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>{worker ? "Editar trabajador" : "Nuevo trabajador"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <PersonalInfoSection form={form} isSubmitting={isSubmitting} />
            <WorkInfoSection 
              form={form} 
              isSubmitting={isSubmitting} 
              departments={departments}
              shifts={shifts}
              workdayTypes={workdayTypes}
            />
            <SenioritySection form={form} isSubmitting={isSubmitting} />
            <NotificationPreferences form={form} isSubmitting={isSubmitting} />
          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {worker ? "Guardar cambios" : "Crear trabajador"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
