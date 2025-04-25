
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Department, ShiftType, WorkdayType } from "@/types";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./schema";

interface WorkInfoSectionProps {
  form: UseFormReturn<FormValues>;
  isSubmitting: boolean;
  departments: Department[];
  shifts: ShiftType[];
  workdayTypes: WorkdayType[];
}

export function WorkInfoSection({ form, isSubmitting, departments, shifts, workdayTypes }: WorkInfoSectionProps) {
  return (
    <div className="space-y-4">
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
    </div>
  );
}

