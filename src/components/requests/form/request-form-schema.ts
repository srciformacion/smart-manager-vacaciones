
import * as z from "zod";
import { DateRange } from "@/types/date-range";

export const requestFormSchema = z.object({
  dateRange: z.object({
    from: z.date(),
    to: z.date().optional(),
  }).transform((val): DateRange => ({
    from: val.from,
    to: val.to
  })),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  shiftProfileId: z.string().optional(),
  replacementUserId: z.string().optional(),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

// For backwards compatibility with existing components
export const formSchema = requestFormSchema;

export type RequestFormValues = z.infer<typeof requestFormSchema>;
export type FormValues = RequestFormValues;
