
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { DateRangePicker } from "@/components/ui/date-range-picker";
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
    <FormField
      control={form.control}
      name="dateRange"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Fecha del turno a cambiar</FormLabel>
          <FormControl>
            <DateRangePicker
              value={field.value}
              onChange={field.onChange}
              disabled={isSubmitting}
              workGroup={user.workGroup}
            />
          </FormControl>
          <FormDescription>
            Seleccione la fecha para la que desea solicitar el cambio de turno
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
