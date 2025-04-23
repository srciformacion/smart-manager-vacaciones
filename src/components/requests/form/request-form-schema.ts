
import * as z from "zod";

export const formSchema = z.object({
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
  reason: z.string().optional(),
  notes: z.string().optional(),
  shiftProfileId: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  replacementUserId: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

