
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./request-form-schema";
import { RequestType } from "@/types";

interface RequestDetailsSectionProps {
  form: UseFormReturn<FormValues>;
  requestType: RequestType;
  isSubmitting?: boolean;
}

export function RequestDetailsSection({ form, requestType, isSubmitting }: RequestDetailsSectionProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="reason"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Motivo</FormLabel>
            <FormControl>
              <Input
                placeholder="Indique el motivo de la solicitud"
                disabled={isSubmitting}
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormDescription>
              {requestType === "leave"
                ? "Obligatorio para permisos justificados"
                : "Opcional"}
            </FormDescription>
            <FormMessage />
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
    </>
  );
}

