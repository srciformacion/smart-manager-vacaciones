
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WorkdayType } from "@/types";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../schema";

interface WorkdaySelectProps {
  form: UseFormReturn<FormValues>;
  workdayTypes: WorkdayType[];
  isSubmitting: boolean;
}

export function WorkdaySelect({ form, workdayTypes, isSubmitting }: WorkdaySelectProps) {
  return (
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
  );
}
