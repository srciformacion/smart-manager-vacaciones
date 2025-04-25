
import { User } from "./index";

export type ShiftColor = 
  | "blue"   // Mañana
  | "amber"  // Tarde
  | "indigo" // Noche
  | "red"    // 24h
  | "green"  // Libre
  | "purple" // Guardia
  | "gray"   // Sin asignar
  | "orange" // Formación
  | "yellow" // Especial
  | "teal"   // Localizado
  | "pink";  // Custom

export type ShiftType = 
  | "morning"    // Mañana
  | "afternoon"  // Tarde
  | "night"      // Noche
  | "24h"        // 24h
  | "free"       // Libre
  | "guard"      // Guardia
  | "unassigned" // Sin asignar
  | "training"   // Formación
  | "special"    // Especial
  | "oncall"     // Localizado
  | "custom";    // Personalizado

export interface CalendarShift {
  id: string;
  userId: string;
  date: Date;
  type: ShiftType;
  startTime?: string;
  endTime?: string;
  color: ShiftColor;
  hours: number;
  notes?: string;
  isException?: boolean;
  exceptionReason?: string;
}

export interface AnnualHours {
  userId: string;
  year: number;
  baseHours: number;       // Horas anuales base según convenio
  workedHours: number;     // Horas trabajadas acumuladas
  vacationHours: number;   // Horas de vacaciones disfrutadas
  sickLeaveHours: number;  // Horas de baja médica
  personalLeaveHours: number; // Horas de permiso personal
  seniorityAdjustment: number; // Ajuste por antigüedad (8h por año)
  specialCircumstances?: SpecialCircumstances;
  remainingHours: number;  // Horas restantes para cumplir con convenio
}

export interface SpecialCircumstances {
  id: string;
  userId: string;
  hasReducedWorkday: boolean;
  reductionPercentage?: number;
  hasBreastfeedingPermit: boolean;
  breastfeedingEndDate?: Date;
  parentalLeave?: {
    startDate: Date;
    endDate: Date;
    type: "maternity" | "paternity" | "adoption";
  };
  otherPermits?: {
    type: string;
    startDate: Date;
    endDate: Date;
    description: string;
  }[];
}

export interface CalendarTemplate {
  id: string;
  name: string;
  description?: string;
  shifts: {
    day: number;
    type: ShiftType;
    startTime: string;
    endTime: string;
    hours: number;
  }[];
}
