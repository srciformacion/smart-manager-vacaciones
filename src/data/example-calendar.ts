
import { addDays, format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { CalendarShift, AnnualHours, SpecialCircumstances, CalendarTemplate } from '@/types/calendar';
import { v4 as uuidv4 } from 'uuid';

// Función de ayuda para crear fechas
const createDate = (year: number, month: number, day: number) => new Date(year, month - 1, day);

// Definir algunos ejemplos de turnos para un usuario específico
export const exampleShifts: CalendarShift[] = [
  // Primer turno de mañana
  {
    id: uuidv4(),
    userId: "1", // Ana Martínez
    date: createDate(2025, 4, 1),
    type: "morning",
    startTime: "07:00",
    endTime: "15:00",
    color: "blue",
    hours: 8,
  },
  // Turno de tarde
  {
    id: uuidv4(),
    userId: "1",
    date: createDate(2025, 4, 2),
    type: "afternoon",
    startTime: "15:00",
    endTime: "23:00",
    color: "amber",
    hours: 8,
  },
  // Turno de noche
  {
    id: uuidv4(),
    userId: "1",
    date: createDate(2025, 4, 3),
    type: "night",
    startTime: "23:00",
    endTime: "07:00",
    color: "indigo",
    hours: 8,
  },
  // Turno de 24h
  {
    id: uuidv4(),
    userId: "1",
    date: createDate(2025, 4, 5),
    type: "24h",
    startTime: "08:00",
    endTime: "08:00",
    color: "red",
    hours: 24,
  },
  // Día libre
  {
    id: uuidv4(),
    userId: "1",
    date: createDate(2025, 4, 7),
    type: "free",
    color: "green",
    hours: 0,
  },
  // Guardia
  {
    id: uuidv4(),
    userId: "1",
    date: createDate(2025, 4, 10),
    type: "guard",
    startTime: "08:00",
    endTime: "20:00",
    color: "purple",
    hours: 12,
  },
  // Sin asignar
  {
    id: uuidv4(),
    userId: "1",
    date: createDate(2025, 4, 12),
    type: "unassigned",
    color: "gray",
    hours: 0,
  },
  // Formación
  {
    id: uuidv4(),
    userId: "1",
    date: createDate(2025, 4, 15),
    type: "training",
    startTime: "09:00",
    endTime: "14:00",
    color: "orange",
    hours: 5,
    notes: "Curso de primeros auxilios",
  },
  // Especial
  {
    id: uuidv4(),
    userId: "1",
    date: createDate(2025, 4, 20),
    type: "special",
    startTime: "08:00",
    endTime: "15:00",
    color: "yellow",
    hours: 7,
    notes: "Evento especial",
    isException: true,
    exceptionReason: "Evento corporativo",
  },
  // Localizado
  {
    id: uuidv4(),
    userId: "1",
    date: createDate(2025, 4, 25),
    type: "oncall",
    startTime: "00:00",
    endTime: "23:59",
    color: "teal",
    hours: 8,
    notes: "Localizado en casa",
  },
  
  // Algunos turnos para Luis García
  {
    id: uuidv4(),
    userId: "2", // Luis García
    date: createDate(2025, 4, 1),
    type: "24h",
    startTime: "08:00",
    endTime: "08:00",
    color: "red",
    hours: 24,
  },
  {
    id: uuidv4(),
    userId: "2",
    date: createDate(2025, 4, 4),
    type: "24h",
    startTime: "08:00",
    endTime: "08:00",
    color: "red",
    hours: 24,
  },
  {
    id: uuidv4(),
    userId: "2",
    date: createDate(2025, 4, 7),
    type: "24h",
    startTime: "08:00",
    endTime: "08:00",
    color: "red",
    hours: 24,
  },
  {
    id: uuidv4(),
    userId: "2",
    date: createDate(2025, 4, 10),
    type: "free",
    color: "green",
    hours: 0,
  },
  {
    id: uuidv4(),
    userId: "2",
    date: createDate(2025, 4, 11),
    type: "free",
    color: "green",
    hours: 0,
  },
  {
    id: uuidv4(),
    userId: "2",
    date: createDate(2025, 4, 12),
    type: "free",
    color: "green",
    hours: 0,
  },
];

// Ejemplo de datos de horas anuales para cada trabajador
export const exampleAnnualHours: AnnualHours[] = [
  {
    userId: "1", // Ana Martínez
    year: 2025,
    baseHours: 1700, // Horas anuales según convenio
    workedHours: 475, // Horas trabajadas hasta la fecha
    vacationHours: 40, // 5 días de vacaciones
    sickLeaveHours: 0,
    personalLeaveHours: 8, // 1 día de permiso personal
    seniorityAdjustment: 24, // 3 años * 8h por año
    remainingHours: 1153, // Restantes
  },
  {
    userId: "2", // Luis García
    year: 2025,
    baseHours: 1700,
    workedHours: 592, // Más horas trabajadas por guardias 24h
    vacationHours: 0, // Sin vacaciones tomadas aún
    sickLeaveHours: 16, // 2 días de baja
    personalLeaveHours: 0,
    seniorityAdjustment: 16, // 2 años * 8h por año
    remainingHours: 1076, // Restantes
  },
  {
    userId: "3", // Elena Sánchez
    year: 2025,
    baseHours: 1700,
    workedHours: 510,
    vacationHours: 64, // 8 días de vacaciones
    sickLeaveHours: 24, // 3 días de baja
    personalLeaveHours: 16, // 2 día de permiso personal
    seniorityAdjustment: 40, // 5 años * 8h por año
    remainingHours: 1046, // Restantes
    specialCircumstances: {
      id: uuidv4(),
      userId: "3",
      hasReducedWorkday: true,
      reductionPercentage: 20, // Reducción del 20% de jornada
      hasBreastfeedingPermit: false,
      otherPermits: [
        {
          type: "Cuidado familiar",
          startDate: createDate(2025, 1, 15),
          endDate: createDate(2025, 12, 31),
          description: "Reducción por cuidado de familiar dependiente"
        }
      ]
    }
  },
  {
    userId: "4", // Francisco José Fernández López
    year: 2025,
    baseHours: 1700,
    workedHours: 430,
    vacationHours: 96, // 12 días de vacaciones (más por antigüedad)
    sickLeaveHours: 0,
    personalLeaveHours: 8,
    seniorityAdjustment: 192, // 24 años * 8h por año
    remainingHours: 974,
  }
];

// Ejemplos de circunstancias especiales
export const exampleSpecialCircumstances: SpecialCircumstances[] = [
  {
    id: uuidv4(),
    userId: "3", // Elena Sánchez
    hasReducedWorkday: true,
    reductionPercentage: 20, // Reducción del 20% de jornada
    hasBreastfeedingPermit: false,
    otherPermits: [
      {
        type: "Cuidado familiar",
        startDate: createDate(2025, 1, 15),
        endDate: createDate(2025, 12, 31),
        description: "Reducción por cuidado de familiar dependiente"
      }
    ]
  }
];

// Plantillas de calendario predefinidas
export const calendarTemplates: CalendarTemplate[] = [
  {
    id: uuidv4(),
    name: "Semana estándar mañanas",
    description: "Turno de mañanas de lunes a viernes",
    shifts: [
      { day: 1, type: "morning", startTime: "07:00", endTime: "15:00", hours: 8 }, // Lunes
      { day: 2, type: "morning", startTime: "07:00", endTime: "15:00", hours: 8 }, // Martes
      { day: 3, type: "morning", startTime: "07:00", endTime: "15:00", hours: 8 }, // Miércoles
      { day: 4, type: "morning", startTime: "07:00", endTime: "15:00", hours: 8 }, // Jueves
      { day: 5, type: "morning", startTime: "07:00", endTime: "15:00", hours: 8 }, // Viernes
      { day: 6, type: "free", startTime: "", endTime: "", hours: 0 }, // Sábado
      { day: 0, type: "free", startTime: "", endTime: "", hours: 0 }, // Domingo
    ]
  },
  {
    id: uuidv4(),
    name: "Ciclo 24h",
    description: "Ciclo de 24h cada 3 días",
    shifts: [
      { day: 1, type: "24h", startTime: "08:00", endTime: "08:00", hours: 24 },
      { day: 2, type: "free", startTime: "", endTime: "", hours: 0 },
      { day: 3, type: "free", startTime: "", endTime: "", hours: 0 },
    ]
  }
];

// Función generadora para obtener todos los turnos del mes para un usuario
export function generateMonthlyShifts(userId: string, year: number, month: number): CalendarShift[] {
  const startDate = startOfMonth(new Date(year, month - 1));
  const endDate = endOfMonth(startDate);
  
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Filtrar los turnos existentes del usuario en este mes
  const existingShifts = exampleShifts.filter(shift => 
    shift.userId === userId && 
    shift.date.getMonth() === month - 1 && 
    shift.date.getFullYear() === year
  );
  
  // Para los días sin turnos asignados, crear turnos "unassigned"
  const allShifts: CalendarShift[] = [];
  
  days.forEach(day => {
    const existingShift = existingShifts.find(
      shift => shift.date.getDate() === day.getDate()
    );
    
    if (existingShift) {
      allShifts.push(existingShift);
    } else {
      allShifts.push({
        id: uuidv4(),
        userId,
        date: day,
        type: "unassigned",
        color: "gray",
        hours: 0
      });
    }
  });
  
  return allShifts;
}

// Función para calcular las horas trabajadas en un período
export function calculateWorkedHours(userId: string, startDate: Date, endDate: Date): number {
  return exampleShifts
    .filter(shift => 
      shift.userId === userId && 
      shift.date >= startDate && 
      shift.date <= endDate
    )
    .reduce((total, shift) => total + shift.hours, 0);
}
