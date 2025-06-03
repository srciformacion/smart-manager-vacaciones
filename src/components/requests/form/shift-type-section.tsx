
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { RequestFormValues } from "./request-form-schema";
import { TimeSelectionSection } from "./time-selection-section";

interface ShiftTypeSectionProps {
  form: UseFormReturn<RequestFormValues>;
  isSubmitting?: boolean;
}

export function ShiftTypeSection({ form, isSubmitting }: ShiftTypeSectionProps) {
  const isFullShift = form.watch("isFullShift");

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="isFullShift"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Tipo de cambio de turno</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={(value) => field.onChange(value === "true")}
                value={field.value ? "true" : "false"}
                disabled={isSubmitting}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="full-shift" />
                  <Label htmlFor="full-shift">Cambio de turno completo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="partial-shift" />
                  <Label htmlFor="partial-shift">Cambio de horas específicas</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormDescription>
              Seleccione si desea cambiar el turno completo o solo unas horas específicas
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {!isFullShift && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="changeStartTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora de inicio del cambio</FormLabel>
                <FormControl>
                  <input
                    type="time"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isSubmitting}
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="changeEndTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora de fin del cambio</FormLabel>
                <FormControl>
                  <input
                    type="time"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
      )}
    </div>
  );
}
