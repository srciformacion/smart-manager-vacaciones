
import { useState, useEffect } from "react";
import { CalendarShift, AnnualHours } from "@/types/calendar";
import { toast } from "sonner";
import { 
  fetchShifts, 
  saveShift as apiSaveShift, 
  fetchAnnualHours, 
  updateWorkedHours as apiUpdateWorkedHours,
  exportCalendarData 
} from "./calendar/calendar-api";
import { 
  navigateDate, 
  calculateMonthStats, 
  calculateAnnualStats 
} from "./calendar/calendar-utils";

export function useWorkCalendar(userId: string) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [shifts, setShifts] = useState<CalendarShift[]>([]);
  const [annualHours, setAnnualHours] = useState<AnnualHours | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Function to load calendar data
  const loadCalendarData = async (date: Date = new Date()) => {
    setIsLoading(true);
    
    try {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      
      // Load monthly shifts
      const monthlyShifts = await fetchShifts(userId, year, month);
      setShifts(monthlyShifts);
      
      // Load annual hours
      const hours = await fetchAnnualHours(userId);
      if (hours) {
        setAnnualHours(hours);
      }
    } catch (error) {
      console.error("Error loading calendar data:", error);
      toast.error("No se pudieron cargar los datos del calendario");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to save a shift
  const saveShift = async (shift: CalendarShift) => {
    const savedShift = await apiSaveShift(shift);
    
    if (savedShift) {
      setShifts(prevShifts => {
        const otherShifts = prevShifts.filter(s => s.id !== shift.id);
        return [...otherShifts, savedShift];
      });
    }
    
    return savedShift;
  };

  // Function to update worked hours
  const updateWorkedHours = async (hours: number) => {
    if (!annualHours) return null;
    
    const updatedHours = await apiUpdateWorkedHours(userId, hours, annualHours);
    
    if (updatedHours) {
      setAnnualHours(prev => ({
        ...prev!,
        workedHours: hours
      }));
    }
    
    return updatedHours;
  };

  // Navigation functions
  const navigate = (type: 'day' | 'month' | 'year', direction: 'previous' | 'next') => {
    const nextDate = navigateDate(currentDate, type, direction);
    setCurrentDate(nextDate);
    loadCalendarData(nextDate);
  };

  const nextMonth = () => navigate('month', 'next');
  const previousMonth = () => navigate('month', 'previous');
  const selectDate = (date: Date) => {
    setCurrentDate(date);
    loadCalendarData(date);
  };

  // Load initial data
  useEffect(() => {
    if (userId) {
      loadCalendarData(currentDate);
    }
  }, [userId]);

  return {
    currentDate,
    shifts,
    annualHours,
    isLoading,
    nextMonth,
    previousMonth,
    selectDate,
    navigate,
    calculateMonthStats: () => calculateMonthStats(currentDate, shifts, annualHours),
    calculateAnnualStats: () => calculateAnnualStats(annualHours),
    exportData: exportCalendarData,
    saveShift,
    updateWorkedHours
  };
}
