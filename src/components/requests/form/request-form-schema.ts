
import * as z from "zod";

export const requestFormSchema = z.object({
  startDate: z.date({
    required_error: "La fecha de inicio es obligatoria",
  }),
  endDate: z.date({
    required_error: "La fecha de fin es obligatoria",
  }),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  shiftProfileId: z.string().optional(),
  replacementUserId: z.string().optional(),
  isPriority: z.boolean().default(false),
  notes: z.string().optional(),
}).refine((data) => {
  return data.endDate >= data.startDate;
}, {
  message: "La fecha de fin debe ser posterior o igual a la fecha de inicio",
  path: ["endDate"],
});

// For backwards compatibility with existing components
export const formSchema = requestFormSchema;

export type RequestFormValues = z.infer<typeof requestFormSchema>;
export type FormValues = RequestFormValues;
