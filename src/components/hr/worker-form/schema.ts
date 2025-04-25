
import * as z from "zod";
import { ShiftType, WorkdayType, Department, WorkGroup } from "@/types";

export const formSchema = z.object({
  name: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  email: z.string().email({ message: "Email no válido" }),
  department: z.string().min(1, { message: "Seleccione un departamento" }),
  shift: z.string().min(1, { message: "Seleccione un turno" }),
  workday: z.string().min(1, { message: "Seleccione un tipo de jornada" }),
  seniorityYears: z.coerce.number().min(0, { message: "Los años no pueden ser negativos" }),
  seniorityMonths: z.coerce.number().min(0, { message: "Los meses no pueden ser negativos" }).max(11, { message: "Los meses deben ser entre 0 y 11" }),
  seniorityDays: z.coerce.number().min(0, { message: "Los días no pueden ser negativos" }).max(30, { message: "Los días deben ser entre 0 y 30" }),
  preferredNotificationChannel: z.enum(["web", "email", "whatsapp"]),
  consentNotifications: z.boolean().refine(val => val === true, {
    message: "Debe aceptar el uso de notificaciones"
  }),
});

export type FormValues = z.infer<typeof formSchema>;

