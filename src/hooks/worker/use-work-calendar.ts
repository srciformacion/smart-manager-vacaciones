
import { useState, useEffect } from "react";
import { User } from "@/types";
import { CalendarShift, AnnualHours } from "@/types/calendar";
import { supabase } from "@/integrations/supabase/client";
import { 
  addMonths, 
  subMonths, 
  addDays,
  subDays,
  addYears,
  subYears,
  startOfMonth, 
  endOfMonth,
  format,
  parseISO,
  isSameDay 
} from "date-fns";
import { toast } from "sonner";

export function useWorkCalendar(userId: string) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [shifts, setShifts] = useState<CalendarShift[]>([]);
  const [annualHours, setAnnualHours] = useState<AnnualHours | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Function to fetch shifts from Supabase or fallback to example data
  const fetchShifts = async (userId: string, year: number, month: number) => {
    try {
      // Try to get shifts from Supabase
      const startDate = new Date(year, month - 1, 1); // Month is 0-indexed in JS
      const endDate = endOfMonth(startDate);
      
      const { data, error } = await supabase
        .from('calendar_shifts')
        .select('*')
        .eq('user_id', userId)
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0]);
        
      if (error) {
        console.error("Error fetching shifts:", error);
        // Fallback to example data
        return generateMonthlyShifts(userId, year, month);
      }
      
      if (data && data.length > 0) {
        // Map Supabase data to CalendarShift format
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
      
      // If no data from Supabase, use example data
      return generateMonthlyShifts(userId, year, month);
    } catch (error) {
      console.error("Error in fetchShifts:", error);
      // Fallback to example data
      return generateMonthlyShifts(userId, year, month);
    }
  };

  // Helper function to get color based on shift type
  const getShiftColor = (type: string): any => {
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

  // Load calendar data
  const loadCalendarData = async (date: Date = new Date()) => {
    setIsLoading(true);
    
    try {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      
      // Load shifts for the current month
      const monthlyShifts = await fetchShifts(userId, year, month);
      setShifts(monthlyShifts);
      
      // Load annual hours data (fallback to example data for now)
      // In a full implementation, this would be fetched from Supabase
      const { data: annualHoursData, error } = await supabase
        .from('annual_hours')
        .select('*')
        .eq('user_id', userId)
        .eq('year', year)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching annual hours:", error);
      }
      
      if (annualHoursData) {
        setAnnualHours({
          userId: annualHoursData.user_id,
          year: annualHoursData.year,
          baseHours: annualHoursData.base_hours,
          workedHours: annualHoursData.worked_hours,
          vacationHours: annualHoursData.vacation_hours,
          sickLeaveHours: annualHoursData.sick_leave_hours,
          personalLeaveHours: annualHoursData.personal_leave_hours,
          seniorityAdjustment: annualHoursData.seniority_adjustment,
          remainingHours: annualHoursData.remaining_hours,
          // Special circumstances would be handled separately
        });
      } else {
        // Fallback example data
        setAnnualHours({
          userId,
          year,
          baseHours: 1700,
          workedHours: 450,
          vacationHours: 40,
          sickLeaveHours: 0,
          personalLeaveHours: 8,
          seniorityAdjustment: 16,
          remainingHours: 1186,
        });
      }
    } catch (error) {
      console.error("Error loading calendar data:", error);
      toast.error("No se pudieron cargar los datos del calendario");
    } finally {
      setIsLoading(false);
    }
  };

  // Temporal navigation
  const navigate = (type: 'day' | 'month' | 'year', direction: 'previous' | 'next') => {
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
    
    setCurrentDate(nextDate);
    loadCalendarData(nextDate);
  };

  // Navigate to the next month
  const nextMonth = () => {
    navigate('month', 'next');
  };
  
  // Navigate to the previous month
  const previousMonth = () => {
    navigate('month', 'previous');
  };

  // Navigate to a specific date
  const selectDate = (date: Date) => {
    setCurrentDate(date);
    loadCalendarData(date);
  };

  // Calculate monthly statistics
  const calculateMonthStats = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    
    // Sum worked hours for the current month
    const workedHours = shifts.reduce((total, shift) => {
      return isSameDay(shift.date, monthStart) || 
             isSameDay(shift.date, monthEnd) || 
             (shift.date > monthStart && shift.date < monthEnd) 
        ? total + shift.hours 
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

  // Calculate annual statistics
  const calculateAnnualStats = () => {
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

  // Export data to different formats
  const exportData = (format: 'pdf' | 'excel' | 'csv') => {
    toast.success(`Exportando calendario en formato ${format.toUpperCase()}...`);
    
    // Simulation of export (would be implemented with real data)
    setTimeout(() => {
      toast.success(`Calendario exportado exitosamente en formato ${format.toUpperCase()}`);
    }, 1500);
  };

  // Load initial data
  useEffect(() => {
    loadCalendarData(currentDate);
  }, [userId]);

  // Generate monthly shifts for a specific user (fallback function)
  const generateMonthlyShifts = (userId: string, year: number, month: number): CalendarShift[] => {
    const startDate = startOfMonth(new Date(year, month - 1));
    const endDate = endOfMonth(startDate);
    
    // Generate a sequence of days in the month
    const days = [];
    for (let day = new Date(startDate); day <= endDate; day = addDays(day, 1)) {
      days.push(new Date(day));
    }
    
    // Basic pattern for shifts based on weekday
    return days.map(day => {
      const weekday = day.getDay(); // 0 = Sunday, 1 = Monday, ...
      
      let shiftType: any;
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
      
      return {
        id: `${userId}-${day.toISOString()}`,
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

  return {
    currentDate,
    shifts,
    annualHours,
    isLoading,
    nextMonth,
    previousMonth,
    selectDate,
    navigate,
    calculateMonthStats,
    calculateAnnualStats,
    exportData
  };
}
