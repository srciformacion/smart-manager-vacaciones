
export type CalendarView = 'month' | 'week' | 'day' | 'list';

export type ShiftType = 
  | 'morning' 
  | 'afternoon' 
  | 'night' 
  | '24h' 
  | 'free' 
  | 'guard' 
  | 'unassigned' 
  | 'training' 
  | 'special' 
  | 'oncall'
  | 'custom';

export interface CalendarShift {
  id: string;
  userId: string;
  date: Date;
  type: ShiftType;
  color: string;
  hours?: number;
  startTime?: string;
  endTime?: string;
  notes?: string;
  isException?: boolean;
  exceptionReason?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  color?: string;
  userId?: string;
  type?: string;
  details?: any;
}

export interface AnnualHours {
  userId: string;
  year: number;
  baseHours: number;
  workedHours: number;
  vacationHours: number;
  sickLeaveHours: number;
  personalLeaveHours: number;
  seniorityAdjustment: number;
  remainingHours: number;
  specialCircumstances?: SpecialCircumstances;
}

export interface ShiftProfile {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  isDefault: boolean;
  userId?: string;
  shiftType?: string;
  workDays?: string[];
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
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

export interface SpecialCircumstances {
  id?: string;
  userId: string;
  hasReducedWorkday?: boolean;
  reductionPercentage?: number;
  hasBreastfeedingPermit?: boolean;
  breastfeedingEndDate?: Date;
  otherPermits?: {
    type: string;
    startDate: Date;
    endDate: Date;
    description: string;
  }[];
}
