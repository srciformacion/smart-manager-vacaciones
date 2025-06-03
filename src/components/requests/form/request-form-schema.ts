
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
  replacementUserName: z.string().optional(),
  isPriority: z.boolean().default(false),
  notes: z.string().optional(),
  isFullShift: z.boolean().default(true),
  changeStartTime: z.string().optional(),
  changeEndTime: z.string().optional(),
}).refine((data) => {
  return data.endDate >= data.startDate;
}, {
  message: "La fecha de fin debe ser posterior o igual a la fecha de inicio",
  path: ["endDate"],
}).refine((data) => {
  if (!data.isFullShift && (!data.changeStartTime || !data.changeEndTime)) {
    return false;
  }
  return true;
}, {
  message: "Debe especificar las horas de inicio y fin para el cambio parcial",
  path: ["changeStartTime"],
});

// For backwards compatibility with existing components
export const formSchema = requestFormSchema;

export type RequestFormValues = z.infer<typeof requestFormSchema>;
export type FormValues = RequestFormValues;
