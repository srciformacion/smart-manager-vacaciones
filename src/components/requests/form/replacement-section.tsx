
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "@/types";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./request-form-schema";

interface ReplacementSectionProps {
  form: UseFormReturn<FormValues>;
  user: User;
  availableUsers: User[];
  isSubmitting?: boolean;
}

export function ReplacementSection({ form, user, availableUsers, isSubmitting }: ReplacementSectionProps) {
  return (
    <FormField
      control={form.control}
      name="replacementUserId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Compañero de reemplazo</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
            disabled={isSubmitting}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un compañero" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {availableUsers
                .filter(u => u.id !== user.id && u.department === user.department)
                .map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <FormDescription>
            Seleccione el compañero con quien desea intercambiar el turno
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

