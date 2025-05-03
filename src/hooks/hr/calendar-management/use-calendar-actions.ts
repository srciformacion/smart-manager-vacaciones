
import { 
  generateMonthlyShifts 
} from "@/data/calendar/shifts";
import { exampleAnnualHours } from "@/data/calendar/hours";
import { CalendarState, CalendarActions } from "./types";
import { User } from "@/types";
import { CalendarShift } from "@/types/calendar";
import { 
  addMonths, 
  subMonths, 
  addDays, 
  subDays, 
  addYears, 
  subYears 
} from "date-fns";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

export function useCalendarActions(
  state: CalendarState, 
  setState: React.Dispatch<React.SetStateAction<CalendarState>>
): CalendarActions {
  // Cargar los turnos del mes para un usuario específico
  const loadUserMonthlyShifts = (user: User, date: Date = new Date()) => {
    setState(prev => ({
      ...prev,
      selectedUser: user,
      currentDate: date
    }));
    
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    
    const userShifts = generateMonthlyShifts(user.id, year, month);
    setState(prev => ({ ...prev, shifts: userShifts }));
    
    // Cargar datos de horas anuales
    const userAnnualHours = exampleAnnualHours.find(h => h.userId === user.id) || null;
    setState(prev => ({ ...prev, annualHours: userAnnualHours }));
  };
  
  // Navegación temporal
  const navigate = (type: 'day' | 'month' | 'year', direction: 'previous' | 'next') => {
    if (!state.selectedUser) return;
    
    let nextDate: Date;
    
    switch (type) {
      case 'day':
        nextDate = direction === 'next' ? addDays(state.currentDate, 1) : subDays(state.currentDate, 1);
        break;
      case 'month':
        nextDate = direction === 'next' ? addMonths(state.currentDate, 1) : subMonths(state.currentDate, 1);
        break;
      case 'year':
        nextDate = direction === 'next' ? addYears(state.currentDate, 1) : subYears(state.currentDate, 1);
        break;
      default:
        nextDate = state.currentDate;
    }
    
    loadUserMonthlyShifts(state.selectedUser, nextDate);
  };
  
  // Cambiar al mes siguiente
  const nextMonth = () => {
    navigate('month', 'next');
  };
  
  // Cambiar al mes anterior
  const previousMonth = () => {
    navigate('month', 'previous');
  };
  
  // Seleccionar fecha específica
  const selectDate = (date: Date) => {
    if (!state.selectedUser) return;
    loadUserMonthlyShifts(state.selectedUser, date);
  };
  
  // Actualizar un turno
  const updateShift = (shiftId: string, updatedData: Partial<CalendarShift>) => {
    setState(prev => {
      const updatedShifts = prev.shifts.map(shift => {
        if (shift.id === shiftId) {
          return { ...shift, ...updatedData };
        }
        return shift;
      });
      
      return { ...prev, shifts: updatedShifts };
    });
    
    toast({
      title: "Turno actualizado",
      description: "El turno ha sido actualizado correctamente.",
    });
  };
  
  // Seleccionar un turno para editar
  const selectShiftForEdit = (shift: CalendarShift) => {
    setState(prev => ({
      ...prev,
      selectedShift: shift,
      isEditing: true
    }));
  };
  
  // Cancelar la edición
  const cancelEdit = () => {
    setState(prev => ({
      ...prev,
      selectedShift: null,
      isEditing: false
    }));
  };

  return {
    loadUserMonthlyShifts,
    nextMonth,
    previousMonth,
    navigate,
    selectDate,
    updateShift,
    selectShiftForEdit,
    cancelEdit
  };
}
