
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { User } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Esquema de validación para el formulario
const formSchema = z.object({
  date: z.date({
    required_error: "Debe seleccionar una fecha para el cambio",
  }),
  replacementUserId: z.string({
    required_error: "Debe seleccionar un compañero para el cambio",
  }),
  returnDate: z.date().optional(),
  reason: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ShiftChangeFormProps {
  user: User;
  coworkers: User[];
  onSubmit: (values: FormValues) => void;
  isSubmitting?: boolean;
}

export function ShiftChangeForm({
  user,
  coworkers,
  onSubmit,
  isSubmitting = false,
}: ShiftChangeFormProps) {
  // Filtrar compañeros del mismo departamento
  const eligibleCoworkers = coworkers.filter(
    (coworker) => coworker.department === user.department
  );

  // Inicializar formulario
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: "",
    },
  });

  // Manejar envío del formulario
  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Solicitud de cambio de turno</CardTitle>
        <CardDescription>
          Complete los datos para solicitar un cambio de turno con un compañero
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Fecha del cambio */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha del turno a cambiar</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={isSubmitting}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: es })
                          ) : (
                            <span>Seleccione una fecha</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Seleccione la fecha del turno que desea cambiar
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Compañero para el cambio */}
            <FormField
              control={form.control}
              name="replacementUserId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Compañero para el cambio</FormLabel>
                  <Select
                    disabled={isSubmitting || eligibleCoworkers.length === 0}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un compañero" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {eligibleCoworkers.length > 0 ? (
                        eligibleCoworkers.map((coworker) => (
                          <SelectItem key={coworker.id} value={coworker.id}>
                            {coworker.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          No hay compañeros disponibles en su departamento
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    El compañero debe ser del mismo departamento y tener función equivalente
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fecha de devolución */}
            <FormField
              control={form.control}
              name="returnDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha de devolución (opcional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={isSubmitting}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: es })
                          ) : (
                            <span>Seleccione una fecha (opcional)</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Fecha propuesta para devolver el turno (debe ser dentro del mismo año)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Motivo del cambio */}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo del cambio (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Indique el motivo del cambio de turno"
                      disabled={isSubmitting}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
