
import { 
  addDays,
  subDays,
  addMonths, 
  subMonths, 
  addYears,
  subYears,
  startOfMonth,
  endOfMonth,
  format,
  isSameDay,
} from "date-fns";
import { CalendarShift, ShiftType } from "@/types/calendar";
import { CalendarMonthStats, CalendarAnnualStats } from "./types";

// Helper function to get color based on shift type
export const getShiftColor = (type: string): string => {
  switch (type) {
    case "morning": return "blue";
    case "afternoon": return "amber";
    case "night": return "indigo";
    case "24h": return "red";
    case "free": return "green";
    case "guard": return "purple";
    case "unassigned": return "gray";
    case "training": return "orange";
    case "special": return "yellow";
    case "oncall": return "teal";
    case "custom": return "pink";
    default: return "gray";
  }
};

// Function to navigate between dates (day, month, year)
export const navigateDate = (
  currentDate: Date,
  type: 'day' | 'month' | 'year', 
  direction: 'previous' | 'next'
): Date => {
  let nextDate: Date;
  
  switch (type) {
    case 'day':
      nextDate = direction === 'next' ? addDays(currentDate, 1) : subDays(currentDate, 1);
      break;
    case 'month':
      nextDate = direction === 'next' ? addMonths(currentDate, 1) : subMonths(currentDate, 1);
      break;
    case 'year':
      nextDate = direction === 'next' ? addYears(currentDate, 1) : subYears(currentDate, 1);
      break;
    default:
      nextDate = currentDate;
  }
  
  return nextDate;
};

// Calculate monthly statistics for calendar
export const calculateMonthStats = (
  currentDate: Date, 
  shifts: CalendarShift[], 
  annualHours: any
): CalendarMonthStats => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  // Sum the hours worked in the current month
  const workedHours = shifts.reduce((total, shift) => {
    return isSameDay(shift.date, monthStart) || 
           isSameDay(shift.date, monthEnd) || 
           (shift.date > monthStart && shift.date < monthEnd) 
      ? total + (shift.hours || 0) 
      : total;
  }, 0);
  
  const expectedHours = annualHours ? Math.round(annualHours.baseHours / 12) : 0;
  const difference = workedHours - expectedHours;
  
  return {
    month: format(currentDate, 'MMMM yyyy'),
    workedHours,
    expectedHours,
    difference,
    status: difference >= 0 ? "positive" : "negative"
  };
};

// Calculate annual statistics for calendar
export const calculateAnnualStats = (annualHours: any): CalendarAnnualStats | null => {
  if (!annualHours) return null;
  
  const totalExpected = annualHours.baseHours;
  const totalWorked = annualHours.workedHours;
  const remaining = annualHours.remainingHours;
  const extraHours = Math.max(0, totalWorked - (totalExpected - remaining));
  
  return {
    year: annualHours.year,
    totalExpected,
    totalWorked,
    remaining,
    extraHours,
    status: extraHours > 0 ? "positive" : (remaining > totalExpected * 0.2 ? "warning" : "negative")
  };
};

// Generate a stable ID for demo shifts
export const generateStableShiftId = (userId: string, day: Date): string => {
  return `demo-${userId}-${day.toISOString().split('T')[0]}`;
};
