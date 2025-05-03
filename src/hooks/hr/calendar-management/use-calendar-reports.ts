
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
  
  // Generar un informe de vacaciones
  const generateVacationsReport = (userId: string, year: number) => {
    toast({
      title: "Informe de vacaciones generado",
      description: `Se ha generado el informe de vacaciones para el año ${year}`,
    });
    
    // Datos simulados de ejemplo para el informe de vacaciones
    return {
      userId,
      year,
      vacationDays: {
        total: 22, // Días totales de vacaciones por convenio
        taken: 10, // Días tomados
        remaining: 12, // Días restantes
        planned: 5, // Días planificados pero no disfrutados aún
      },
      periods: [
        {
          startDate: new Date(year, 6, 1), // 1 de julio
          endDate: new Date(year, 6, 15), // 15 de julio
          days: 10,
          status: 'disfrutado'
        },
        {
          startDate: new Date(year, 11, 20), // 20 de diciembre
          endDate: new Date(year, 11, 24), // 24 de diciembre
          days: 5,
          status: 'planificado'
        }
      ],
      summary: {
        firstHalf: 10, // Días en primer semestre
        secondHalf: 5, // Días en segundo semestre
        distribution: 'Correcta' // Evaluación de la distribución
      }
    };
  };

  return {
    generateHoursReport,
    generateVacationsReport
  };
}
