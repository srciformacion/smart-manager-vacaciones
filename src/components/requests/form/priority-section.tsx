
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { RequestFormValues } from "./request-form-schema";
import { RequestType } from "@/types";

interface PrioritySectionProps {
  form: UseFormReturn<RequestFormValues>;
  requestType: RequestType;
  isSubmitting?: boolean;
}

export function PrioritySection({ form, requestType, isSubmitting }: PrioritySectionProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="isPriority"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">
                Solicitud prioritaria
              </FormLabel>
              <FormDescription>
                Marcar si esta solicitud requiere tratamiento prioritario
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isSubmitting}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Notas adicionales</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Información adicional sobre la solicitud (opcional)"
                disabled={isSubmitting}
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
