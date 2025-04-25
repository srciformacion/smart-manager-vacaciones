
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Department } from "@/types";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../schema";

interface DepartmentSelectProps {
  form: UseFormReturn<FormValues>;
  departments: Department[];
  isSubmitting: boolean;
}

export function DepartmentSelect({ form, departments, isSubmitting }: DepartmentSelectProps) {
  return (
    <FormField
      control={form.control}
      name="department"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Departamento</FormLabel>
          <Select
            disabled={isSubmitting}
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un departamento" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
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
