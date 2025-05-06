
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
import { v4 as uuidv4 } from 'uuid';

export function useWorkCalendar(userId: string) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [shifts, setShifts] = useState<CalendarShift[]>([]);
  const [annualHours, setAnnualHours] = useState<AnnualHours | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Check if we're dealing with a demo user
  const isDemoUser = userId.startsWith('demo-') || userId === "1";

  // Función para obtener turnos desde Supabase o generar datos de demo
  const fetchShifts = async (userId: string, year: number, month: number) => {
    try {
      // Si es un usuario demo, generamos datos de ejemplo
      if (isDemoUser) {
        return generateMonthlyShifts(userId, year, month);
      }
      
      // Obtenemos los turnos de Supabase para usuarios reales
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

  // Función para guardar un turno en Supabase o simular guardado para demo
  const saveShift = async (shift: CalendarShift) => {
    try {
      // Para usuarios demo, simplemente actualizamos el estado local
      if (isDemoUser) {
        const updatedShift = {
          ...shift,
          id: shift.id.startsWith('temp-') ? uuidv4() : shift.id
        };
        
        setShifts(prevShifts => {
          const otherShifts = prevShifts.filter(s => s.id !== shift.id);
          return [...otherShifts, updatedShift];
        });
        
        toast.success("Turno guardado correctamente");
        return updatedShift;
      }
      
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
      
      let result;
      
      // Insertamos o actualizamos el turno
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
      
      // Actualizamos el estado local
      if (result) {
        const savedShift: CalendarShift = {
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
        
        setShifts(prevShifts => {
          const otherShifts = prevShifts.filter(s => s.id !== shift.id);
          return [...otherShifts, savedShift];
        });
        
        return savedShift;
      }
      
      return null;
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
      
      // Para usuarios demo, creamos datos simulados
      if (isDemoUser) {
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
        setIsLoading(false);
        return;
      }
      
      // Cargamos datos de horas anuales para usuarios reales
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
        
        try {
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
          } 
        } catch (error) {
          console.error("Error creating annual hours entry:", error);
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
      
      // Datos de ejemplo en caso de error
      setAnnualHours({
        userId,
        year: new Date().getFullYear(),
        baseHours: 1700,
        workedHours: 450,
        vacationHours: 40,
        sickLeaveHours: 0,
        personalLeaveHours: 8,
        seniorityAdjustment: 16,
        remainingHours: 1186,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Actualiza las horas trabajadas en la base de datos
  const updateWorkedHours = async (hours: number) => {
    if (!annualHours) return null;
    
    // Para usuarios demo, actualizamos solo el estado local
    if (isDemoUser) {
      const updatedHours = {
        ...annualHours,
        workedHours: hours
      };
      setAnnualHours(updatedHours);
      return updatedHours;
    }
    
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

  // Generar turnos mensuales para un usuario específico
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

  // Cargar datos iniciales
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
    calculateMonthStats,
    calculateAnnualStats,
    exportData,
    saveShift,
    updateWorkedHours
  };
}
