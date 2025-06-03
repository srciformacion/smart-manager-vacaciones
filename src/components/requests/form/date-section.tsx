
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { DatePicker } from "@/components/ui/date-picker";
import { UseFormReturn } from "react-hook-form";
import { RequestFormValues } from "./request-form-schema";
import { User } from "@/types";

interface DateSectionProps {
  form: UseFormReturn<RequestFormValues>;
  user: User;
  isSubmitting?: boolean;
}

export function DateSection({ form, user, isSubmitting }: DateSectionProps) {
  return (
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
            <FormDescription>
              Seleccione la fecha de inicio del cambio de turno
            </FormDescription>
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
            <FormDescription>
              Seleccione la fecha de fin del cambio de turno
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
