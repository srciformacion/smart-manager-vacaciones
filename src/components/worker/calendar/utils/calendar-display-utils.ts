
import { ShiftType } from '@/types/calendar';
import { addDays, format, startOfMonth, endOfMonth, getDay } from 'date-fns';

export function getShiftTypeLabel(type: ShiftType): string {
  switch (type) {
    case "morning": return "Mañana";
    case "afternoon": return "Tarde";
    case "night": return "Noche";
    case "24h": return "24 Horas";
    case "free": return "Libre";
    case "guard": return "Guardia";
    case "oncall": return "Localizado";
    case "training": return "Formación";
    case "special": return "Especial";
    case "custom": return "Personalizado";
    default: return "No asignado";
  }
}

export function generateCalendarDays(currentDate: Date): Date[] {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const dateRange = [];
  let currentDatePointer = monthStart;
  
  // Adjust to start week on Monday
  while (getDay(currentDatePointer) !== 1 && currentDatePointer.getTime() > monthStart.getTime() - 7 * 24 * 60 * 60 * 1000) {
    currentDatePointer = addDays(currentDatePointer, -1);
  }
  
  for (let i = 0; i < 42; i++) {
    dateRange.push(new Date(currentDatePointer));
    currentDatePointer = addDays(currentDatePointer, 1);
  }
  
  return dateRange;
}

export const DAYS_OF_WEEK = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
