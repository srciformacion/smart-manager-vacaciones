
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { User } from "@/types";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./request-form-schema";

interface DateRangeSectionProps {
  form: UseFormReturn<FormValues>;
  user: User;
  isSubmitting?: boolean;
}

export function DateRangeSection({ form, user, isSubmitting }: DateRangeSectionProps) {
  return (
    <FormField
      control={form.control}
      name="dateRange"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Periodo solicitado</FormLabel>
          <FormControl>
            <DateRangePicker
              value={field.value}
              onChange={field.onChange}
              disabled={isSubmitting}
              workGroup={user.workGroup}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

