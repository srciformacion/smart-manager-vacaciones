
import { Clock } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { RequestFormValues } from "./request-form-schema";
import { ShiftProfile } from "@/types/calendar";

interface TimeSelectionSectionProps {
  form: UseFormReturn<RequestFormValues>;
  shiftProfiles?: ShiftProfile[];
  isSubmitting?: boolean;
}

export function TimeSelectionSection({ form, shiftProfiles, isSubmitting }: TimeSelectionSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="startTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hora de inicio</FormLabel>
            <div className="relative">
              <Clock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <FormControl>
                <Input
                  type="time"
                  className="pl-8"
                  disabled={isSubmitting}
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="endTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hora de fin</FormLabel>
            <div className="relative">
              <Clock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <FormControl>
                <Input
                  type="time"
                  className="pl-8"
                  disabled={isSubmitting}
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
