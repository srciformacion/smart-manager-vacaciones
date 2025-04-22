
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Balance, User } from "@/types";
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Esquema de validación para el formulario
const formSchema = z.object({
  vacationDays: z.coerce.number().min(0, { message: "El valor no puede ser negativo" }),
  personalDays: z.coerce.number().min(0, { message: "El valor no puede ser negativo" }),
  leaveDays: z.coerce.number().min(0, { message: "El valor no puede ser negativo" }),
  reason: z.string().min(5, { message: "Por favor, indique el motivo del ajuste" }),
});

type FormValues = z.infer<typeof formSchema>;

interface BalanceFormProps {
  worker: User;
  balance?: Balance;
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function BalanceForm({
  worker,
  balance,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: BalanceFormProps) {
  // Inicializar formulario
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vacationDays: balance?.vacationDays || 0,
      personalDays: balance?.personalDays || 0,
      leaveDays: balance?.leaveDays || 0,
      reason: "",
    },
  });

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Ajustar saldos</CardTitle>
        <CardDescription>
          Ajuste manual de los días disponibles para {worker.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Información del trabajador */}
            <div className="rounded-lg border p-4 mb-6">
              <h3 className="text-sm font-medium mb-2">Datos del trabajador</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Nombre:</div>
                <div>{worker.name}</div>
                <div className="text-muted-foreground">Departamento:</div>
                <div>{worker.department}</div>
                <div className="text-muted-foreground">Turno:</div>
                <div>{worker.shift}</div>
                <div className="text-muted-foreground">Grupo:</div>
                <div>{worker.workGroup}</div>
              </div>
            </div>

            {/* Días de vacaciones */}
            <FormField
              control={form.control}
              name="vacationDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Días de vacaciones</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    {balance && (
                      <div className="text-sm text-muted-foreground">
                        (Actual: {balance.vacationDays})
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Días de asuntos propios */}
            <FormField
              control={form.control}
              name="personalDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Días de asuntos propios</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    {balance && (
                      <div className="text-sm text-muted-foreground">
                        (Actual: {balance.personalDays})
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Días de permisos justificados */}
            <FormField
              control={form.control}
              name="leaveDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Días de permisos justificados</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    {balance && (
                      <div className="text-sm text-muted-foreground">
                        (Actual: {balance.leaveDays})
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Motivo del ajuste */}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo del ajuste</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Indique el motivo del ajuste de saldos"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Esta información quedará registrada en el historial
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className="px-0 flex flex-col sm:flex-row gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar cambios"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
