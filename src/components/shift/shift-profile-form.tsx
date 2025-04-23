
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ShiftType, User, WeekDay, ShiftProfile } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock } from "lucide-react";

// Esquema de validación
const formSchema = z.object({
  shiftType: z.string(),
  workDays: z.array(z.string()),
  startTime: z.string(),
  endTime: z.string(),
  createdBy: z.enum(['trabajador', 'empresa']),
  isDefault: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const weekDays: { value: WeekDay; label: string }[] = [
  { value: 'monday', label: 'Lunes' },
  { value: 'tuesday', label: 'Martes' },
  { value: 'wednesday', label: 'Miércoles' },
  { value: 'thursday', label: 'Jueves' },
  { value: 'friday', label: 'Viernes' },
  { value: 'saturday', label: 'Sábado' },
  { value: 'sunday', label: 'Domingo' },
];

const shiftTypes: { value: ShiftType; label: string }[] = [
  { value: 'Turno 24h', label: 'Turno 24h' },
  { value: 'Localizado', label: 'Localizado' },
  { value: 'Programado Mañana', label: 'Programado Mañana' },
  { value: 'Programado Tarde', label: 'Programado Tarde' },
  { value: 'Programado Noche', label: 'Programado Noche' },
  { value: 'Teleoperación Turno Mañana', label: 'Teleoperación Turno Mañana' },
  { value: 'Teleoperación Turno Tarde', label: 'Teleoperación Turno Tarde' },
  { value: 'Teleoperación Turno Noche', label: 'Teleoperación Turno Noche' },
];

interface ShiftProfileFormProps {
  user?: User;
  existingProfile?: ShiftProfile;
  onSubmit: (values: FormValues) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function ShiftProfileForm({
  user,
  existingProfile,
  onSubmit,
  onCancel,
  isSubmitting = false
}: ShiftProfileFormProps) {
  // Inicializar el formulario con valores existentes o predeterminados
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: existingProfile ? {
      shiftType: existingProfile.shiftType,
      workDays: existingProfile.workDays,
      startTime: existingProfile.startTime,
      endTime: existingProfile.endTime,
      createdBy: existingProfile.createdBy,
      isDefault: existingProfile.isDefault,
    } : {
      shiftType: '',
      workDays: [],
      startTime: '09:00',
      endTime: '17:00',
      createdBy: user?.role === 'hr' ? 'empresa' : 'trabajador',
      isDefault: false,
    },
  });

  // Obtener el tipo de turno seleccionado
  const selectedShiftType = form.watch("shiftType") as ShiftType;
  
  // Autocompletar horarios según el tipo de turno
  const handleShiftTypeChange = (value: string) => {
    form.setValue("shiftType", value);
    
    // Establecer horarios predeterminados según el tipo de turno
    switch (value) {
      case 'Turno 24h':
        form.setValue("startTime", "08:00");
        form.setValue("endTime", "08:00");
        break;
      case 'Programado Mañana':
        form.setValue("startTime", "08:00");
        form.setValue("endTime", "15:00");
        break;
      case 'Programado Tarde':
        form.setValue("startTime", "15:00");
        form.setValue("endTime", "22:00");
        break;
      case 'Programado Noche':
        form.setValue("startTime", "22:00");
        form.setValue("endTime", "08:00");
        break;
      case 'Teleoperación Turno Mañana':
        form.setValue("startTime", "08:00");
        form.setValue("endTime", "15:00");
        break;
      case 'Teleoperación Turno Tarde':
        form.setValue("startTime", "15:00");
        form.setValue("endTime", "22:00");
        break;
      case 'Teleoperación Turno Noche':
        form.setValue("startTime", "22:00");
        form.setValue("endTime", "08:00");
        break;
      default:
        break;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Perfil de turno</CardTitle>
        <CardDescription>
          {existingProfile 
            ? "Edite la información de su perfil de turno" 
            : "Configure su perfil de turno habitual"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Tipo de turno */}
            <FormField
              control={form.control}
              name="shiftType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de turno</FormLabel>
                  <Select 
                    onValueChange={handleShiftTypeChange} 
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un tipo de turno" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {shiftTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Días laborales */}
            <FormField
              control={form.control}
              name="workDays"
              render={() => (
                <FormItem>
                  <div className="mb-2">
                    <FormLabel>Días laborales habituales</FormLabel>
                    <FormDescription>
                      Seleccione los días que normalmente trabaja con este tipo de turno
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {weekDays.map((day) => (
                      <FormField
                        key={day.value}
                        control={form.control}
                        name="workDays"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={day.value}
                              className="flex flex-row items-center space-x-2 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(day.value)}
                                  disabled={isSubmitting}
                                  onCheckedChange={(checked) => {
                                    const currentValue = [...field.value || []];
                                    if (checked) {
                                      field.onChange([...currentValue, day.value]);
                                    } else {
                                      field.onChange(
                                        currentValue.filter((value) => value !== day.value)
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {day.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Horario */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Hora de inicio */}
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora de inicio</FormLabel>
                    <div className="relative">
                      <Clock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input
                          type="time"
                          className="pl-8"
                          disabled={isSubmitting || selectedShiftType === 'Turno 24h'}
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Hora de fin */}
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora de fin</FormLabel>
                    <div className="relative">
                      <Clock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input
                          type="time"
                          className="pl-8"
                          disabled={isSubmitting || selectedShiftType === 'Turno 24h'}
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Creador del perfil */}
            <FormField
              control={form.control}
              name="createdBy"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Perfil creado por</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="trabajador" />
                        </FormControl>
                        <FormLabel className="font-normal">Trabajador</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="empresa" />
                        </FormControl>
                        <FormLabel className="font-normal">Empresa</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Perfil predeterminado */}
            <FormField
              control={form.control}
              name="isDefault"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Establecer como perfil predeterminado</FormLabel>
                    <FormDescription>
                      Este será su perfil de turno principal para solicitudes
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* Botones */}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={onCancel} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : existingProfile ? "Actualizar perfil" : "Crear perfil"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
