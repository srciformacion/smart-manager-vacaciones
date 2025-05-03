
import { User } from "@/types";
import { CalendarShift, AnnualHours } from "@/types/calendar";

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
  updateShift: (shiftId: string, updatedData: Partial<CalendarShift>) => void;
  selectShiftForEdit: (shift: CalendarShift) => void;
  cancelEdit: () => void;
}

export interface CalendarTemplateActions {
  applyTemplateToRange: (templateId: string, startDate: Date, endDate: Date, userId: string) => void;
}

export interface CalendarReportActions {
  generateHoursReport: (userId: string, year: number) => any;
}

export interface CalendarExportActions {
  exportToExcel: (userId: string, year: number, month: number) => void;
  importFromExcel: (file: File) => void;
}
