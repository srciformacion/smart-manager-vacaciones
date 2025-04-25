
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./schema";

interface SenioritySectionProps {
  form: UseFormReturn<FormValues>;
  isSubmitting: boolean;
}

export function SenioritySection({ form, isSubmitting }: SenioritySectionProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="seniorityYears"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Antigüedad - Años</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                placeholder="Años"
                disabled={isSubmitting}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="seniorityMonths"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Antigüedad - Meses</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                max="11"
                placeholder="Meses"
                disabled={isSubmitting}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="seniorityDays"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Antigüedad - Días</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                max="30"
                placeholder="Días"
                disabled={isSubmitting}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

