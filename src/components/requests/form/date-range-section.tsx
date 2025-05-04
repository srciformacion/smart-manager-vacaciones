
import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { User, RequestType } from "@/types";
import { getVacationRules } from "@/utils/vacationLogic";

interface DateRangeSectionProps {
  form: any;
  user: User;
  isSubmitting: boolean;
  requestType: RequestType;
}

export function DateRangeSection({ form, user, isSubmitting, requestType }: DateRangeSectionProps) {
  return (
    <FormField
      control={form.control}
      name="dateRange"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Fechas</FormLabel>
          <FormControl>
            <DatePickerWithRange
              date={{
                from: field.value?.from || undefined,
                to: field.value?.to || undefined,
              }}
              setDate={field.onChange}
              disabled={isSubmitting}
              className="w-full"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
