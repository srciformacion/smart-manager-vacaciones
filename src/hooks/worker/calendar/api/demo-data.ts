
import { CalendarShift, ShiftType } from "@/types/calendar";
import { addDays, format, startOfMonth, endOfMonth } from "date-fns";
import { getShiftColor, generateStableShiftId } from "../calendar-utils";

// Function to check if we're dealing with a demo user
export const isDemoUser = (userId: string): boolean => {
  return userId.startsWith('demo-') || userId === "1" || userId === "demo-user";
};

// Generate monthly shifts for demo users
export const generateMonthlyShifts = (userId: string, year: number, month: number): CalendarShift[] => {
  const startDate = startOfMonth(new Date(year, month - 1));
  const endDate = endOfMonth(startDate);
  
  // Generate a sequence of days in the month
  const days = [];
  let currentDay = new Date(startDate);
  while (currentDay <= endDate) {
    days.push(new Date(currentDay));
    currentDay = addDays(currentDay, 1);
  }
  
  // Basic shift pattern based on day of week
  return days.map(day => {
    const weekday = day.getDay(); // 0 = Sunday, 1 = Monday, ...
    
    let shiftType: ShiftType;
    let hours: number;
    let startTime: string | undefined;
    let endTime: string | undefined;
    
    switch (weekday) {
      case 1: // Monday
        shiftType = "morning";
        hours = 8;
        startTime = "07:00";
        endTime = "15:00";
        break;
      case 2: // Tuesday
        shiftType = "morning";
        hours = 8;
        startTime = "07:00";
        endTime = "15:00";
        break;
      case 3: // Wednesday
        shiftType = "afternoon";
        hours = 8;
        startTime = "15:00";
        endTime = "23:00";
        break;
      case 4: // Thursday
        shiftType = "afternoon";
        hours = 8;
        startTime = "15:00";
        endTime = "23:00";
        break;
      case 5: // Friday
        shiftType = "night";
        hours = 8;
        startTime = "23:00";
        endTime = "07:00";
        break;
      case 6: // Saturday
        shiftType = "free";
        hours = 0;
        break;
      case 0: // Sunday
        shiftType = "free";
        hours = 0;
        break;
      default:
        shiftType = "unassigned";
        hours = 0;
    }
    
    // Create the shift with a stable ID for demos
    return {
      id: generateStableShiftId(userId, day),
      userId,
      date: day,
      type: shiftType,
      startTime,
      endTime,
      color: getShiftColor(shiftType),
      hours,
    };
  });
};

// Generate demo annual hours data
export const generateDemoAnnualHours = (userId: string): any => {
  const year = new Date().getFullYear();
  
  return {
    userId,
    year,
    baseHours: 1700,
    workedHours: 450,
    vacationHours: 40,
    sickLeaveHours: 0,
    personalLeaveHours: 8,
    seniorityAdjustment: 16,
    remainingHours: 1186,
  };
};
