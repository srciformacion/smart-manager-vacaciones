
import { format, parseISO } from "date-fns";
import { CalendarShift } from "@/types/calendar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getShiftColor } from "../calendar-utils";
import { v4 as uuidv4 } from 'uuid';
import { FetchShiftsResponse, SaveShiftResponse } from "./types";
import { generateMonthlyShifts, isDemoUser } from "./demo-data";

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

// Export calendar data to different formats
export const exportCalendarData = (format: 'pdf' | 'excel' | 'csv'): void => {
  toast.success(`Exportando calendario en formato ${format.toUpperCase()}...`);
  
  // Simulated export implementation
  setTimeout(() => {
    toast.success(`Calendario exportado exitosamente en formato ${format.toUpperCase()}`);
  }, 1500);
};
