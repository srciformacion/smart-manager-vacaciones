
import { CalendarShift } from '@/types/calendar';
import { v4 as uuidv4 } from 'uuid';
import { addDays, format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

// Helper function to create dates
const createDate = (year: number, month: number, day: number) => new Date(year, month - 1, day);

// Example shifts data
export const exampleShifts: CalendarShift[] = [
  // Morning shift
  {
    id: uuidv4(),
    userId: "1", // Ana Martínez
    date: createDate(2025, 4, 1),
    type: "morning",
    startTime: "07:00",
    endTime: "15:00",
    color: "blue",
    hours: 8,
  },
  // Afternoon shift
  {
    id: uuidv4(),
    userId: "1",
    date: createDate(2025, 4, 2),
    type: "afternoon",
    startTime: "15:00",
    endTime: "23:00",
    color: "amber",
    hours: 8,
  },
  // Night shift
  {
    id: uuidv4(),
    userId: "1",
    date: createDate(2025, 4, 3),
    type: "night",
    startTime: "23:00",
    endTime: "07:00",
    color: "indigo",
    hours: 8,
  },
  // 24h shift
  {
    id: uuidv4(),
    userId: "1",
    date: createDate(2025, 4, 5),
    type: "24h",
    startTime: "08:00",
    endTime: "08:00",
    color: "red",
    hours: 24,
  },
  // Free day
  {
    id: uuidv4(),
    userId: "1",
    date: createDate(2025, 4, 7),
    type: "free",
    color: "green",
    hours: 0,
  }
];

// Generate monthly shifts for a specific user
export function generateMonthlyShifts(userId: string, year: number, month: number): CalendarShift[] {
  const startDate = startOfMonth(new Date(year, month - 1));
  const endDate = endOfMonth(startDate);
  
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Filter existing shifts for the user in this month
  const existingShifts = exampleShifts.filter(shift => 
    shift.userId === userId && 
    shift.date.getMonth() === month - 1 && 
    shift.date.getFullYear() === year
  );
  
  // For days without assigned shifts, create "unassigned" shifts
  return days.map(day => {
    const existingShift = existingShifts.find(
      shift => shift.date.getDate() === day.getDate()
    );
    
    if (existingShift) {
      return existingShift;
    }
    
    return {
      id: uuidv4(),
      userId,
      date: day,
      type: "unassigned",
      color: "gray",
      hours: 0
    };
  });
}

// Calculate worked hours in a period
export function calculateWorkedHours(userId: string, startDate: Date, endDate: Date): number {
  return exampleShifts
    .filter(shift => 
      shift.userId === userId && 
      shift.date >= startDate && 
      shift.date <= endDate
    )
    .reduce((total, shift) => total + shift.hours, 0);
}
