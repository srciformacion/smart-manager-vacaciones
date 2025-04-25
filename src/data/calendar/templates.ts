
import { CalendarTemplate } from '@/types/calendar';
import { v4 as uuidv4 } from 'uuid';

// Predefined calendar templates
export const calendarTemplates: CalendarTemplate[] = [
  {
    id: uuidv4(),
    name: "Semana estándar mañanas",
    description: "Turno de mañanas de lunes a viernes",
    shifts: [
      { day: 1, type: "morning", startTime: "07:00", endTime: "15:00", hours: 8 },
      { day: 2, type: "morning", startTime: "07:00", endTime: "15:00", hours: 8 },
      { day: 3, type: "morning", startTime: "07:00", endTime: "15:00", hours: 8 },
      { day: 4, type: "morning", startTime: "07:00", endTime: "15:00", hours: 8 },
      { day: 5, type: "morning", startTime: "07:00", endTime: "15:00", hours: 8 },
      { day: 6, type: "free", startTime: "", endTime: "", hours: 0 },
      { day: 0, type: "free", startTime: "", endTime: "", hours: 0 },
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
