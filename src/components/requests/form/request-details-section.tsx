
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { RequestFormValues } from "./request-form-schema";
import { RequestType } from "@/types";

interface RequestDetailsSectionProps {
  form: UseFormReturn<RequestFormValues>;
  requestType: RequestType;
  isSubmitting?: boolean;
}

export function RequestDetailsSection({ form, requestType, isSubmitting }: RequestDetailsSectionProps) {
  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Notas adicionales</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Información adicional que desee aportar"
              disabled={isSubmitting}
              {...field}
              value={field.value || ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
