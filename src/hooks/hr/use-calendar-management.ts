
import { useState } from "react";
import { User } from "@/types";
import { CalendarShift, ShiftType, AnnualHours } from "@/types/calendar";
import { 
  exampleShifts, 
  generateMonthlyShifts, 
  calculateWorkedHours 
} from "@/data/calendar/shifts";
import { exampleAnnualHours } from "@/data/calendar/hours";
import { v4 as uuidv4 } from "uuid";
import { startOfMonth, endOfMonth, format, addMonths, subMonths, addDays } from "date-fns";
import { toast } from "@/components/ui/use-toast";

export function useCalendarManagement() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [shifts, setShifts] = useState<CalendarShift[]>([]);
  const [annualHours, setAnnualHours] = useState<AnnualHours | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedShift, setSelectedShift] = useState<CalendarShift | null>(null);
  
  // Cargar los turnos del mes para un usuario específico
  const loadUserMonthlyShifts = (user: User, date: Date = new Date()) => {
    setSelectedUser(user);
    setCurrentDate(date);
    
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    
    const userShifts = generateMonthlyShifts(user.id, year, month);
    setShifts(userShifts);
    
    // Cargar datos de horas anuales
    const userAnnualHours = exampleAnnualHours.find(h => h.userId === user.id) || null;
    setAnnualHours(userAnnualHours);
  };
  
  // Cambiar al mes siguiente
  const nextMonth = () => {
    if (selectedUser) {
      const nextDate = addMonths(currentDate, 1);
      loadUserMonthlyShifts(selectedUser, nextDate);
    }
  };
  
  // Cambiar al mes anterior
  const previousMonth = () => {
    if (selectedUser) {
      const prevDate = subMonths(currentDate, 1);
      loadUserMonthlyShifts(selectedUser, prevDate);
    }
  };
  
  // Actualizar un turno
  const updateShift = (shiftId: string, updatedData: Partial<CalendarShift>) => {
    setShifts(currentShifts => {
      const updatedShifts = currentShifts.map(shift => {
        if (shift.id === shiftId) {
          return { ...shift, ...updatedData };
        }
        return shift;
      });
      
      // En una implementación real, aquí se guardarían los cambios en la base de datos
      
      return updatedShifts;
    });
    
    toast({
      title: "Turno actualizado",
      description: "El turno ha sido actualizado correctamente.",
    });
  };
  
  // Seleccionar un turno para editar
  const selectShiftForEdit = (shift: CalendarShift) => {
    setSelectedShift(shift);
    setIsEditing(true);
  };
  
  // Cancelar la edición
  const cancelEdit = () => {
    setSelectedShift(null);
    setIsEditing(false);
  };
  
  // Aplicar una plantilla de turnos a un rango de fechas
  const applyTemplateToRange = (
    templateId: string, 
    startDate: Date, 
    endDate: Date,
    userId: string
  ) => {
    // En una implementación real, aquí se buscaría la plantilla por su ID
    // y se aplicaría a cada día del rango
    
    // Simulación de la aplicación de plantilla
    toast({
      title: "Plantilla aplicada",
      description: `Plantilla aplicada desde ${format(startDate, 'dd/MM/yyyy')} hasta ${format(endDate, 'dd/MM/yyyy')}`,
    });
    
    // Recargar los turnos
    if (selectedUser) {
      loadUserMonthlyShifts(selectedUser, currentDate);
    }
  };
  
  // Generar un informe de horas
  const generateHoursReport = (userId: string, year: number) => {
    // En una implementación real, aquí se generaría el informe
    // y se devolvería para su visualización o descarga
    
    // Simulación
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
  
  // Exportar calendario a Excel (simulado)
  const exportToExcel = (userId: string, year: number, month: number) => {
    // En una implementación real, aquí se generaría el archivo Excel
    
    toast({
      title: "Exportación iniciada",
      description: `Exportando calendario de ${month}/${year} a Excel...`,
    });
    
    // Simular descarga
    setTimeout(() => {
      toast({
        title: "Exportación completada",
        description: "El calendario ha sido exportado correctamente.",
      });
    }, 1500);
  };
  
  // Importar calendario desde Excel (simulado)
  const importFromExcel = (file: File) => {
    // En una implementación real, aquí se procesaría el archivo Excel
    
    toast({
      title: "Importación iniciada",
      description: `Procesando archivo ${file.name}...`,
    });
    
    // Simular importación
    setTimeout(() => {
      if (selectedUser) {
        loadUserMonthlyShifts(selectedUser, currentDate);
        
        toast({
          title: "Importación completada",
          description: "El calendario ha sido importado correctamente.",
        });
      }
    }, 2000);
  };
  
  return {
    selectedUser,
    currentDate,
    shifts,
    annualHours,
    isEditing,
    selectedShift,
    loadUserMonthlyShifts,
    nextMonth,
    previousMonth,
    updateShift,
    selectShiftForEdit,
    cancelEdit,
    applyTemplateToRange,
    generateHoursReport,
    exportToExcel,
    importFromExcel
  };
}
