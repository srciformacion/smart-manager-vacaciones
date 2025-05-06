
import { CalendarShift, ShiftType, AnnualHours } from "@/types/calendar";

// API Response Types
export interface FetchShiftsResponse {
  shifts: CalendarShift[];
  error?: string;
}

export interface SaveShiftResponse {
  shift: CalendarShift | null;
  error?: string;
}

export interface FetchAnnualHoursResponse {
  hours: AnnualHours | null;
  error?: string;
}

export interface UpdateWorkedHoursResponse {
  hours: AnnualHours | null;
  error?: string;
}

// Export format types
export type ExportFormat = 'pdf' | 'excel' | 'csv';
