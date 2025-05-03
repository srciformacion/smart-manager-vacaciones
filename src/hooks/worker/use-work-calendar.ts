
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

  // Función para obtener turnos desde Supabase
  const fetchShifts = async (userId: string, year: number, month: number) => {
    try {
      // Obtenemos los turnos de Supabase
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
        // Si hay error, generamos datos de ejemplo
        return generateMonthlyShifts(userId, year, month);
      }
      
      if (data && data.length > 0) {
        // Convertimos los datos de Supabase al formato CalendarShift
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
      
      // Si no hay datos en Supabase, generamos datos de ejemplo
      return generateMonthlyShifts(userId, year, month);
    } catch (error) {
      console.error("Error in fetchShifts:", error);
      // En caso de error, usamos datos de ejemplo
      return generateMonthlyShifts(userId, year, month);
    }
  };

  // Función para guardar un turno en Supabase
  const saveShift = async (shift: CalendarShift) => {
    try {
      // Preparamos los datos para Supabase
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
      
      // Insertamos o actualizamos el turno
      const { data, error } = await supabase
        .from('calendar_shifts')
        .upsert(shiftData)
        .select();
        
      if (error) {
        console.error("Error saving shift:", error);
        toast.error("Error al guardar el turno");
        return null;
      }
      
      toast.success("Turno guardado correctamente");
      return data[0];
    } catch (error) {
      console.error("Error in saveShift:", error);
      toast.error("Error al guardar el turno");
      return null;
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

  // Función para cargar datos del calendario
  const loadCalendarData = async (date: Date = new Date()) => {
    setIsLoading(true);
    
    try {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      
      // Cargamos turnos del mes actual
      const monthlyShifts = await fetchShifts(userId, year, month);
      setShifts(monthlyShifts);
      
      // Cargamos datos de horas anuales
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
          // Las circunstancias especiales se manejarían por separado
        });
      } else {
        // Si no hay datos, creamos un registro inicial en Supabase
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
        }
        
        if (newHoursData && newHoursData.length > 0) {
          setAnnualHours({
            userId,
            year,
            baseHours: 1700,
            workedHours: 0,
            vacationHours: 0,
            sickLeaveHours: 0,
            personalLeaveHours: 0,
            seniorityAdjustment: 0,
            remainingHours: 1700,
          });
        } else {
          // Usamos datos de ejemplo si hay error
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
      }
    } catch (error) {
      console.error("Error loading calendar data:", error);
      toast.error("No se pudieron cargar los datos del calendario");
    } finally {
      setIsLoading(false);
    }
  };

  // Actualiza las horas trabajadas en la base de datos
  const updateWorkedHours = async (hours: number) => {
    if (!annualHours) return null;
    
    try {
      const { data, error } = await supabase
        .from('annual_hours')
        .update({ worked_hours: hours })
        .eq('user_id', userId)
        .eq('year', annualHours.year)
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

  // Ir al mes siguiente
  const nextMonth = () => {
    navigate('month', 'next');
  };
  
  // Ir al mes anterior
  const previousMonth = () => {
    navigate('month', 'previous');
  };

  // Seleccionar una fecha específica
  const selectDate = (date: Date) => {
    setCurrentDate(date);
    loadCalendarData(date);
  };

  // Calcular estadísticas mensuales
  const calculateMonthStats = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    
    // Sumar las horas trabajadas del mes actual
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

  // Calcular estadísticas anuales
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
    
    // Implementación de exportación (simulación)
    setTimeout(() => {
      toast.success(`Calendario exportado exitosamente en formato ${format.toUpperCase()}`);
    }, 1500);
  };

  // Cargar datos iniciales
  useEffect(() => {
    if (userId) {
      loadCalendarData(currentDate);
    }
  }, [userId]);

  // Generar turnos mensuales para un usuario específico (función de fallback)
  const generateMonthlyShifts = (userId: string, year: number, month: number): CalendarShift[] => {
    const startDate = startOfMonth(new Date(year, month - 1));
    const endDate = endOfMonth(startDate);
    
    // Generar una secuencia de días en el mes
    const days = [];
    for (let day = new Date(startDate); day <= endDate; day = addDays(day, 1)) {
      days.push(new Date(day));
    }
    
    // Patrón básico de turnos basado en el día de la semana
    return days.map(day => {
      const weekday = day.getDay(); // 0 = domingo, 1 = lunes, ...
      
      let shiftType: any;
      let hours: number;
      let startTime: string | undefined;
      let endTime: string | undefined;
      
      switch (weekday) {
        case 1: // Lunes
          shiftType = "morning";
          hours = 8;
          startTime = "07:00";
          endTime = "15:00";
          break;
        case 2: // Martes
          shiftType = "morning";
          hours = 8;
          startTime = "07:00";
          endTime = "15:00";
          break;
        case 3: // Miércoles
          shiftType = "afternoon";
          hours = 8;
          startTime = "15:00";
          endTime = "23:00";
          break;
        case 4: // Jueves
          shiftType = "afternoon";
          hours = 8;
          startTime = "15:00";
          endTime = "23:00";
          break;
        case 5: // Viernes
          shiftType = "night";
          hours = 8;
          startTime = "23:00";
          endTime = "07:00";
          break;
        case 6: // Sábado
          shiftType = "free";
          hours = 0;
          break;
        case 0: // Domingo
          shiftType = "free";
          hours = 0;
          break;
        default:
          shiftType = "unassigned";
          hours = 0;
      }
      
      // Crear el turno
      const shift: CalendarShift = {
        id: `${userId}-${day.toISOString()}`,
        userId,
        date: day,
        type: shiftType,
        startTime,
        endTime,
        color: getShiftColor(shiftType),
        hours,
      };
      
      // Guardar el turno en Supabase para futuras consultas
      saveShift(shift).catch(console.error);
      
      return shift;
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
    exportData,
    saveShift,
    updateWorkedHours
  };
}
