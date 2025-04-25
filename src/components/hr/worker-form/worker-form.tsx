import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, ShiftType, WorkdayType, Department, WorkGroup } from "@/types";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getVacationRules } from "@/utils/workGroupAssignment";
import { assignWorkGroup } from "@/utils/workGroupAssignment";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { WorkInfoSection } from "./WorkInfoSection";
import { SenioritySection } from "./SenioritySection";
import { NotificationPreferences } from "./NotificationPreferences";
import { formSchema, FormValues } from "./schema";

interface WorkerFormProps {
  worker?: User;
  onSubmit: (values: FormValues & { seniority: number, workGroup: WorkGroup }) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function WorkerForm({
  worker,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: WorkerFormProps) {
  const departments: Department[] = [
    "Urgencias y Emergencias (Transporte Urgente)",
    "Transporte Sanitario Programado",
    "Centro Coordinador Urgente",
    "Centro Coordinador Programado",
    "Mantenimiento de Vehículos",
    "Logística y Almacén",
    "Administración y Finanzas",
    "Recursos Humanos",
    "Calidad, Seguridad y Prevención de Riesgos Laborales",
    "Formación",
    "Atención al cliente",
    "Operaciones",
    "Administración",
    "Personal de movimiento"
  ];

  const shifts: ShiftType[] = [
    "Localizado",
    "Urgente 24h",
    "Urgente 12h",
    "GES Sala Sanitaria",
    "Top Programado",
    "Grupo 1/3",
    "Programado",
  ];

  const workdayTypes: WorkdayType[] = ["Completa", "Parcial", "Reducida"];

  const [calculatedWorkGroup, setCalculatedWorkGroup] = useState<WorkGroup | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: worker?.name || "",
      email: worker?.email || "",
      department: worker?.department || "",
      shift: worker?.shift || "",
      workday: worker?.workday || "",
      seniorityYears: Math.floor(worker?.seniority || 0),
      seniorityMonths: Math.floor(((worker?.seniority || 0) % 1) * 12),
      seniorityDays: Math.floor(((((worker?.seniority || 0) % 1) * 12) % 1) * 30),
      preferredNotificationChannel: worker?.preferredNotificationChannel || "web",
      consentNotifications: true,
    },
  });

  const department = form.watch("department");
  const shift = form.watch("shift");
  const workday = form.watch("workday");

  useEffect(() => {
    if (department && shift && workday) {
      const group = assignWorkGroup(
        shift as ShiftType,
        workday as WorkdayType,
        department as Department
      );
      setCalculatedWorkGroup(group);
    }
  }, [department, shift, workday]);

  const handleSubmit = (values: FormValues) => {
    const totalSeniority = values.seniorityYears + (values.seniorityMonths / 12) + (values.seniorityDays / 365);
    if (calculatedWorkGroup) {
      onSubmit({
        ...values,
        seniority: totalSeniority,
        workGroup: calculatedWorkGroup,
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{worker ? "Editar trabajador" : "Nuevo trabajador"}</CardTitle>
        <CardDescription>
          {worker
            ? "Modifique los datos del trabajador"
            : "Complete los datos para registrar un nuevo trabajador"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
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

            {calculatedWorkGroup && (
              <div className="rounded-lg border p-4">
                <div className="text-sm font-medium mb-2">Grupo de trabajo asignado</div>
                <div className="flex flex-col gap-2">
                  <div className="text-lg font-bold text-primary">
                    {calculatedWorkGroup}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Regla vacacional: {getVacationRules(calculatedWorkGroup)}
                  </div>
                </div>
              </div>
            )}

            <CardFooter className="px-0 flex flex-col sm:flex-row gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !calculatedWorkGroup}
              >
                {isSubmitting
                  ? "Guardando..."
                  : worker
                  ? "Actualizar trabajador"
                  : "Crear trabajador"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
