
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShiftType } from "@/types";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../schema";

interface ShiftSelectProps {
  form: UseFormReturn<FormValues>;
  shifts: ShiftType[];
  isSubmitting: boolean;
}

export function ShiftSelect({ form, shifts, isSubmitting }: ShiftSelectProps) {
  return (
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
  );
}
