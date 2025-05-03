
import { useState, useEffect } from "react";
import { User } from "@/types";
import { CalendarShift, AnnualHours } from "@/types/calendar";
import { 
  exampleShifts, 
  generateMonthlyShifts, 
  calculateWorkedHours 
} from "@/data/calendar/shifts";
import { exampleAnnualHours } from "@/data/calendar/hours";
import { 
  addMonths, 
  subMonths, 
  addDays,
  subDays,
  addYears,
  subYears,
  startOfMonth, 
  endOfMonth, 
  format 
} from "date-fns";
import { toast } from "sonner";

export function useWorkCalendar(userId: string) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [shifts, setShifts] = useState<CalendarShift[]>([]);
  const [annualHours, setAnnualHours] = useState<AnnualHours | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Cargar datos del calendario
  const loadCalendarData = (date: Date = new Date()) => {
    setIsLoading(true);
    
    try {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      
      // Cargar turnos del mes actual
      const monthlyShifts = generateMonthlyShifts(userId, year, month);
      setShifts(monthlyShifts);
      
      // Cargar datos de horas anuales
      const userAnnualHours = exampleAnnualHours.find(h => h.userId === userId) || null;
      setAnnualHours(userAnnualHours);
    } catch (error) {
      console.error("Error al cargar datos del calendario:", error);
      toast.error("No se pudieron cargar los datos del calendario");
    } finally {
      setIsLoading(false);
    }
  };

  // Navegación temporal
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

  // Cambiar al mes siguiente
  const nextMonth = () => {
    navigate('month', 'next');
  };
  
  // Cambiar al mes anterior
  const previousMonth = () => {
    navigate('month', 'previous');
  };

  // Cambiar a una fecha específica
  const selectDate = (date: Date) => {
    setCurrentDate(date);
    loadCalendarData(date);
  };

  // Calcular estadísticas de horas para el mes actual
  const calculateMonthStats = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    
    const workedHours = calculateWorkedHours(userId, monthStart, monthEnd);
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

  // Calcular estadísticas de horas para el año
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

  // Exportar datos a diferentes formatos
  const exportData = (format: 'pdf' | 'excel' | 'csv') => {
    toast.success(`Exportando calendario en formato ${format.toUpperCase()}...`);
    
    // Simulación de exportación
    setTimeout(() => {
      toast.success(`Calendario exportado exitosamente en formato ${format.toUpperCase()}`);
    }, 1500);
  };

  // Efecto para cargar datos iniciales
  useEffect(() => {
    loadCalendarData(currentDate);
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
    calculateMonthStats,
    calculateAnnualStats,
    exportData
  };
}
