
import { useState } from "react";
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
import { RequestType, User, WorkGroup } from "@/types";
import { getVacationRules } from "@/utils/workGroupAssignment";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Esquema de validación para el formulario
const formSchema = z.object({
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface RequestFormProps {
  requestType: RequestType;
  user: User;
  onSubmit: (values: FormValues, file: File | null) => void;
  isSubmitting?: boolean;
}

export function RequestForm({
  requestType,
  user,
  onSubmit,
  isSubmitting = false,
}: RequestFormProps) {
  const [file, setFile] = useState<File | null>(null);
  
  // Inicializar formulario
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateRange: {
        from: new Date(),
        to: new Date(),
      },
      reason: "",
      notes: "",
    },
  });

  // Manejar envío del formulario
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
        return "Solicitud de días por asuntos propios.";
      case "leave":
        return "Solicitud de permiso justificado con documento acreditativo.";
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
            {/* Selector de rango de fechas */}
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
                    />
                  </FormControl>
                  <FormDescription>
                    Seleccione el rango de fechas para su solicitud
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Motivo (obligatorio para permisos justificados) */}
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

            {/* Notas adicionales */}
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

            {/* Carga de archivo (solo para permisos justificados) */}
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

            {/* Botón de envío */}
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Enviando..." : "Enviar solicitud"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
