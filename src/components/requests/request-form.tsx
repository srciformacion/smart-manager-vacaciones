import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DateRange } from "react-day-picker";

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
import { Textarea } from "@/components/ui/textarea";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RequestType, User, WorkGroup, ShiftProfile } from "@/types";
import { getVacationRules } from "@/utils/workGroupAssignment";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

const formSchema = z.object({
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
  reason: z.string().optional(),
  notes: z.string().optional(),
  shiftProfileId: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  replacementUserId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface RequestFormProps {
  requestType: RequestType;
  user: User;
  availableUsers?: User[];
  shiftProfiles?: ShiftProfile[];
  onSubmit: (values: FormValues, file: File | null) => void;
  isSubmitting?: boolean;
}

export function RequestForm({
  requestType,
  user,
  availableUsers = [],
  shiftProfiles = [],
  onSubmit,
  isSubmitting = false,
}: RequestFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [showTimeSelectors, setShowTimeSelectors] = useState(requestType === 'personalDay');
  
  const defaultProfile = shiftProfiles.find(profile => profile.isDefault);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateRange: {
        from: new Date(),
        to: new Date(),
      },
      reason: "",
      notes: "",
      shiftProfileId: defaultProfile?.id || "",
      startTime: defaultProfile?.startTime || "08:00",
      endTime: defaultProfile?.endTime || "15:00",
    },
  });

  const selectedProfileId = form.watch("shiftProfileId");
  
  useEffect(() => {
    if (selectedProfileId) {
      const selectedProfile = shiftProfiles.find(profile => profile.id === selectedProfileId);
      if (selectedProfile) {
        form.setValue("startTime", selectedProfile.startTime);
        form.setValue("endTime", selectedProfile.endTime);
      }
    }
  }, [selectedProfileId, shiftProfiles, form]);

  const handleSubmit = (values: FormValues) => {
    onSubmit(values, file);
  };

  const getRequestTypeTitle = () => {
    switch (requestType) {
      case "vacation":
        return "Solicitud de vacaciones";
      case "personalDay":
        return "Solicitud de asuntos propios";
      case "leave":
        return "Solicitud de permiso justificado";
      case "shiftChange":
        return "Solicitud de cambio de turno";
      default:
        return "Nueva solicitud";
    }
  };

  const getRequestTypeDescription = () => {
    switch (requestType) {
      case "vacation":
        const rules = getVacationRules(user.workGroup as WorkGroup);
        return `Grupo de trabajo: ${user.workGroup}. ${rules}`;
      case "personalDay":
        return "Solicitud de días por asuntos propios. Los días pueden solicitarse en bloques de 8h, 12h o 24h según su turno.";
      case "leave":
        return "Solicitud de permiso justificado con documento acreditativo.";
      case "shiftChange":
        return "Solicitud de cambio de turno con otro compañero. Debe especificar la fecha de devolución.";
      default:
        return "";
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{getRequestTypeTitle()}</CardTitle>
        <CardDescription>{getRequestTypeDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {shiftProfiles.length > 0 && (
              <FormField
                control={form.control}
                name="shiftProfileId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Perfil de turno</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un perfil de turno" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {shiftProfiles.map((profile) => (
                          <SelectItem key={profile.id} value={profile.id}>
                            {profile.shiftType} {profile.isDefault && "(Predeterminado)"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Seleccione el perfil de turno para esta solicitud
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="dateRange"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Periodo solicitado</FormLabel>
                  <FormControl>
                    <DateRangePicker
                      value={field.value as DateRange}
                      onChange={field.onChange}
                      disabled={isSubmitting}
                      workGroup={user.workGroup}
                    />
                  </FormControl>
                  <FormDescription>
                    {requestType === "personalDay" 
                      ? "Seleccione el día para su solicitud de asuntos propios" 
                      : "Seleccione el rango de fechas para su solicitud"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(requestType === 'personalDay' || requestType === 'shiftChange') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            disabled={isSubmitting}
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                            disabled={isSubmitting}
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {requestType === 'shiftChange' && availableUsers.length > 0 && (
              <FormField
                control={form.control}
                name="replacementUserId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compañero de reemplazo</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un compañero" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableUsers
                          .filter(u => u.id !== user.id && u.department === user.department)
                          .map((u) => (
                            <SelectItem key={u.id} value={u.id}>
                              {u.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Seleccione el compañero con quien desea intercambiar el turno
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Indique el motivo de la solicitud"
                      disabled={isSubmitting}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    {requestType === "leave"
                      ? "Obligatorio para permisos justificados"
                      : "Opcional"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas adicionales</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Información adicional que desee aportar"
                      disabled={isSubmitting}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {requestType === "leave" && (
              <FormItem>
                <FormLabel>Justificante</FormLabel>
                <FormControl>
                  <FileUpload
                    onFileChange={setFile}
                    disabled={isSubmitting}
                    buttonText="Subir justificante"
                    placeholder="Seleccione un archivo"
                  />
                </FormControl>
                <FormDescription>
                  Suba un documento justificativo (PDF, imagen)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Enviando..." : "Enviar solicitud"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
