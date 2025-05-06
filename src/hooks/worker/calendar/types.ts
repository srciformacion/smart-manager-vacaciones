
import { AnnualHours, CalendarShift, ShiftType } from "@/types/calendar";

export interface CalendarMonthStats {
  month: string;
  workedHours: number;
  expectedHours: number;
  difference: number;
  status: "positive" | "negative" | "neutral";
}

export interface CalendarAnnualStats {
  year: number;
  totalExpected: number;
  totalWorked: number;
  remaining: number;
  extraHours: number;
  status: "positive" | "negative" | "warning" | "neutral";
}
