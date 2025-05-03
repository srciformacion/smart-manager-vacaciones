
import { useState } from "react";
import { User } from "@/types";
import { CalendarShift, AnnualHours } from "@/types/calendar";
import { CalendarState } from "./types";
import { 
  generateMonthlyShifts 
} from "@/data/calendar/shifts";
import { exampleAnnualHours } from "@/data/calendar/hours";

export function useCalendarState(): CalendarState {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [shifts, setShifts] = useState<CalendarShift[]>([]);
  const [annualHours, setAnnualHours] = useState<AnnualHours | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedShift, setSelectedShift] = useState<CalendarShift | null>(null);
  
  return {
    selectedUser,
    currentDate,
    shifts,
    annualHours,
    isEditing,
    selectedShift,
  };
}

// Export internal state updaters for use by other hooks
export const stateUpdaters = {
  setSelectedUser: (state: CalendarState, user: User | null) => {
    return { ...state, selectedUser: user };
  },
  setCurrentDate: (state: CalendarState, date: Date) => {
    return { ...state, currentDate: date };
  },
  setShifts: (state: CalendarState, shifts: CalendarShift[]) => {
    return { ...state, shifts };
  },
  setAnnualHours: (state: CalendarState, hours: AnnualHours | null) => {
    return { ...state, annualHours: hours };
  },
  setIsEditing: (state: CalendarState, editing: boolean) => {
    return { ...state, isEditing: editing };
  },
  setSelectedShift: (state: CalendarState, shift: CalendarShift | null) => {
    return { ...state, selectedShift: shift };
  },
};
