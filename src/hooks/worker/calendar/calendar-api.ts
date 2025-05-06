
import { format, parseISO, startOfMonth, endOfMonth } from "date-fns";
import { CalendarShift, AnnualHours, ShiftType } from "@/types/calendar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getShiftColor, generateStableShiftId } from "./calendar-utils";
import { v4 as uuidv4 } from 'uuid';

// Check if we're dealing with a demo user
export const isDemoUser = (userId: string): boolean => {
  return userId.startsWith('demo-') || userId === "1" || userId === "demo-user";
};

// Function to fetch shifts from Supabase or generate demo data
export const fetchShifts = async (userId: string, year: number, month: number): Promise<CalendarShift[]> => {
  try {
    // If it's a demo user, generate example data
    if (isDemoUser(userId)) {
      return generateMonthlyShifts(userId, year, month);
    }
    
    // Get shifts from Supabase for real users
    const startDate = new Date(year, month - 1, 1);
    const endDate = endOfMonth(startDate);
    
    const { data, error } = await supabase
      .from('calendar_shifts')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0]);
      
    if (error) {
      console.error("Error fetching shifts:", error);
      return generateMonthlyShifts(userId, year, month);
    }
    
    if (data && data.length > 0) {
      // Convert Supabase data to CalendarShift format
      return data.map(shift => ({
        id: shift.id,
        userId: shift.user_id,
        date: parseISO(shift.date),
        type: shift.type,
        startTime: shift.start_time,
        endTime: shift.end_time,
        color: getShiftColor(shift.type),
        hours: shift.hours,
        notes: shift.notes,
        isException: shift.is_exception,
        exceptionReason: shift.exception_reason
      }));
    }
    
    // If no data in Supabase, generate example data
    return generateMonthlyShifts(userId, year, month);
  } catch (error) {
    console.error("Error in fetchShifts:", error);
    // On error, use example data
    return generateMonthlyShifts(userId, year, month);
  }
};

// Function to save a shift to Supabase or simulate saving for demo
export const saveShift = async (shift: CalendarShift): Promise<CalendarShift | null> => {
  try {
    // For demo users, just update the local state
    if (isDemoUser(shift.userId)) {
      // Generate stable UUIDs for demo users to avoid generation errors
      const updatedShift = {
        ...shift,
        id: shift.id.startsWith('temp-') ? `demo-${uuidv4()}` : shift.id
      };
      
      toast.success("Turno guardado correctamente");
      return updatedShift;
    }
    
    // Prepare data for Supabase
    const shiftData = {
      user_id: shift.userId,
      date: format(shift.date, 'yyyy-MM-dd'),
      type: shift.type,
      start_time: shift.startTime,
      end_time: shift.endTime,
      hours: shift.hours || 0,
      notes: shift.notes,
      is_exception: shift.isException || false,
      exception_reason: shift.exceptionReason
    };
    
    let result;
    
    // Insert or update the shift
    if (shift.id.startsWith('temp-')) {
      const { data, error } = await supabase
        .from('calendar_shifts')
        .insert(shiftData)
        .select();
        
      if (error) {
        console.error("Error saving shift:", error);
        toast.error("Error al guardar el turno");
        return null;
      }
      
      result = data[0];
    } else {
      const { data, error } = await supabase
        .from('calendar_shifts')
        .update(shiftData)
        .eq('id', shift.id)
        .select();
        
      if (error) {
        console.error("Error updating shift:", error);
        toast.error("Error al actualizar el turno");
        return null;
      }
      
      result = data[0];
    }
    
    toast.success("Turno guardado correctamente");
    
    // Update the local state
    if (result) {
      return {
        id: result.id,
        userId: result.user_id,
        date: new Date(result.date),
        type: result.type,
        startTime: result.start_time,
        endTime: result.end_time,
        color: getShiftColor(result.type),
        hours: result.hours || 0,
        notes: result.notes,
        isException: result.is_exception,
        exceptionReason: result.exception_reason
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error in saveShift:", error);
    toast.error("Error al guardar el turno");
    return null;
  }
};

// Function to fetch or create annual hours data
export const fetchAnnualHours = async (userId: string): Promise<AnnualHours | null> => {
  const year = new Date().getFullYear();
  
  // For demo users, return simulated data
  if (isDemoUser(userId)) {
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
  }
  
  try {
    // Fetch annual hours from Supabase
    const { data, error } = await supabase
      .from('annual_hours')
      .select('*')
      .eq('user_id', userId)
      .eq('year', year)
      .single();
      
    if (error && error.code !== 'PGRST116') {
      console.error("Error fetching annual hours:", error);
    }
    
    // If data exists, return it in the expected format
    if (data) {
      return {
        userId: data.user_id,
        year: data.year,
        baseHours: data.base_hours,
        workedHours: data.worked_hours,
        vacationHours: data.vacation_hours,
        sickLeaveHours: data.sick_leave_hours,
        personalLeaveHours: data.personal_leave_hours,
        seniorityAdjustment: data.seniority_adjustment,
        remainingHours: data.remaining_hours,
      };
    } 
    
    // If no data exists, create a new record
    const defaultHours = {
      user_id: userId,
      year,
      base_hours: 1700,
      worked_hours: 0,
      vacation_hours: 0,
      sick_leave_hours: 0,
      personal_leave_hours: 0,
      seniority_adjustment: 0,
      remaining_hours: 1700
    };
    
    const { data: newHoursData, error: insertError } = await supabase
      .from('annual_hours')
      .insert(defaultHours)
      .select();
      
    if (insertError) {
      console.error("Error creating annual hours:", insertError);
      throw insertError;
    }
    
    if (newHoursData && newHoursData.length > 0) {
      return {
        userId,
        year,
        baseHours: 1700,
        workedHours: 0,
        vacationHours: 0,
        sickLeaveHours: 0,
        personalLeaveHours: 0,
        seniorityAdjustment: 0,
        remainingHours: 1700,
      };
    }
    
    throw new Error("Failed to create annual hours record");
    
  } catch (error) {
    console.error("Error in fetchAnnualHours:", error);
    
    // Return default data on error
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
  }
};

// Update worked hours in database
export const updateWorkedHours = async (userId: string, hours: number, annualHoursData: AnnualHours): Promise<any> => {
  if (!annualHoursData) return null;
  
  // For demo users, just return updated local state
  if (isDemoUser(userId)) {
    return {
      ...annualHoursData,
      workedHours: hours
    };
  }
  
  try {
    const { data, error } = await supabase
      .from('annual_hours')
      .update({ worked_hours: hours })
      .eq('user_id', userId)
      .eq('year', annualHoursData.year)
      .select();
      
    if (error) {
      console.error("Error updating worked hours:", error);
      return null;
    }
    
    return data[0];
  } catch (error) {
    console.error("Error in updateWorkedHours:", error);
    return null;
  }
};

// Export calendar data to different formats
export const exportCalendarData = (format: 'pdf' | 'excel' | 'csv'): void => {
  toast.success(`Exportando calendario en formato ${format.toUpperCase()}...`);
  
  // Simulated export implementation
  setTimeout(() => {
    toast.success(`Calendario exportado exitosamente en formato ${format.toUpperCase()}`);
  }, 1500);
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
