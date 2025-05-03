
import { CalendarReportActions } from "./types";
import { format, endOfMonth } from "date-fns";
import { calculateWorkedHours } from "@/data/calendar/shifts";
import { toast } from "@/components/ui/use-toast";
import { AnnualHours } from "@/types/calendar";

export function useCalendarReports(annualHours: AnnualHours | null): CalendarReportActions {
  // Generar un informe de horas
  const generateHoursReport = (userId: string, year: number) => {
    toast({
      title: "Informe generado",
      description: `Se ha generado el informe de horas para el año ${year}`,
    });
    
    // Devolver algunos datos de ejemplo
    return {
      userId,
      year,
      months: Array.from({ length: 12 }, (_, i) => {
        const monthStart = new Date(year, i, 1);
        const monthEnd = endOfMonth(monthStart);
        const hours = calculateWorkedHours(userId, monthStart, monthEnd);
        
        return {
          month: i + 1,
          name: format(monthStart, 'MMMM'),
          hours,
          daysWorked: Math.floor(hours / 8) // Aproximación básica
        };
      }),
      totals: {
        workedHours: annualHours?.workedHours || 0,
        vacationHours: annualHours?.vacationHours || 0,
        sickLeaveHours: annualHours?.sickLeaveHours || 0,
        personalLeaveHours: annualHours?.personalLeaveHours || 0,
        seniorityAdjustment: annualHours?.seniorityAdjustment || 0,
        remainingHours: annualHours?.remainingHours || 0
      }
    };
  };

  return {
    generateHoursReport
  };
}
