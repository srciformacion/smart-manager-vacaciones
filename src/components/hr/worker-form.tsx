
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, ShiftType, WorkdayType, Department, WorkGroup } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getVacationRules } from "@/utils/workGroupAssignment";
import { assignWorkGroup } from "@/utils/workGroupAssignment";
import { useState, useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  email: z.string().email({ message: "Email no válido" }),
  department: z.string().min(1, { message: "Seleccione un departamento" }),
  shift: z.string().min(1, { message: "Seleccione un turno" }),
  workday: z.string().min(1, { message: "Seleccione un tipo de jornada" }),
  seniority: z.coerce.number().min(0, { message: "La antigüedad no puede ser negativa" }),
});

type FormValues = z.infer<typeof formSchema>;

interface WorkerFormProps {
  worker?: User;
  onSubmit: (values: FormValues & { workGroup: WorkGroup }) => void;
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
      seniority: worker?.seniority || 0,
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
        department as Department // Asegurarse de que department sea tratado como Department
      );
      setCalculatedWorkGroup(group);
    }
  }, [department, shift, workday]);

  const handleSubmit = (values: FormValues) => {
    if (calculatedWorkGroup) {
      onSubmit({
        ...values,
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
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre completo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nombre y apellidos"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="ejemplo@empresa.com"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departamento</FormLabel>
                  <Select
                    disabled={isSubmitting}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un departamento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shift"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Turno</FormLabel>
                  <Select
                    disabled={isSubmitting}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un turno" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {shifts.map((shift) => (
                        <SelectItem key={shift} value={shift}>
                          {shift}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    El turno determinará el grupo de trabajo vacacional
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="workday"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de jornada</FormLabel>
                  <Select
                    disabled={isSubmitting}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un tipo de jornada" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {workdayTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="seniority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Antigüedad (años)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Se utilizará para calcular ajustes en los días disponibles
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
