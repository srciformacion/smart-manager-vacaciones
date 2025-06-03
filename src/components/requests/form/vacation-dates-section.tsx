
import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DatePicker } from "@/components/ui/date-picker";
import { User, RequestType } from "@/types";
import { validateDatesForWorkGroup } from "@/utils/vacationLogic";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface VacationDatesSectionProps {
  form: any;
  user: User;
  isSubmitting: boolean;
  requestType: RequestType;
}

export function VacationDatesSection({ form, user, isSubmitting, requestType }: VacationDatesSectionProps) {
  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");
  
  // Validar las fechas cuando ambas estén seleccionadas
  const validation = React.useMemo(() => {
    if (startDate && endDate && user.workGroup) {
      return validateDatesForWorkGroup(startDate, endDate, user.workGroup);
    }
    return { valid: true, message: "" };
  }, [startDate, endDate, user.workGroup]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fecha de inicio</FormLabel>
              <FormControl>
                <DatePicker
                  selectedDate={field.value}
                  onSelect={field.onChange}
                  disabled={isSubmitting}
                  placeholder="Seleccionar fecha de inicio"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fecha de fin</FormLabel>
              <FormControl>
                <DatePicker
                  selectedDate={field.value}
                  onSelect={field.onChange}
                  disabled={isSubmitting}
                  placeholder="Seleccionar fecha de fin"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {!validation.valid && startDate && endDate && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Fechas no válidas:</strong> {validation.message}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
