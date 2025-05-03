
import { User } from "@/types";
import { CalendarShift, AnnualHours, CalendarTemplate } from "@/types/calendar";

export interface CalendarState {
  selectedUser: User | null;
  currentDate: Date;
  shifts: CalendarShift[];
  annualHours: AnnualHours | null;
  isEditing: boolean;
  selectedShift: CalendarShift | null;
}

export interface CalendarActions {
  loadUserMonthlyShifts: (user: User, date?: Date) => void;
  nextMonth: () => void;
  previousMonth: () => void;
  navigate: (type: 'day' | 'month' | 'year', direction: 'previous' | 'next') => void;
  selectDate: (date: Date) => void;
  updateShift: (shiftId: string, updatedData: Partial<CalendarShift>) => void;
  selectShiftForEdit: (shift: CalendarShift) => void;
  cancelEdit: () => void;
}

export interface CalendarTemplateActions {
  loadTemplates: () => void;
  createTemplate: (template: Omit<CalendarTemplate, "id">) => void;
  applyTemplate: (templateId: string, userId: string, month: number, year: number) => void;
  deleteTemplate: (templateId: string) => void;
}

export interface CalendarReportActions {
  generateHoursReport: (userId: string, year: number) => void;
  generateVacationsReport: (userId: string, year: number) => void;
}

export interface CalendarExportActions {
  exportToExcel: (userId: string, year: number, month: number) => void;
  importFromExcel: (file: File) => Promise<boolean>;
}
