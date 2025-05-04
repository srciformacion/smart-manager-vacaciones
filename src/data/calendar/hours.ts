
import { v4 as uuidv4 } from 'uuid';
import { AnnualHours, SpecialCircumstances } from '@/types/calendar';

// Example annual hours data for each worker
export const exampleAnnualHours: AnnualHours[] = [
  {
    userId: "1", // Ana Martínez
    year: 2025,
    baseHours: 1700,
    workedHours: 475,
    vacationHours: 40,
    sickLeaveHours: 0,
    personalLeaveHours: 8,
    seniorityAdjustment: 24,
    remainingHours: 1153,
  },
  {
    userId: "2", // Luis García
    year: 2025,
    baseHours: 1700,
    workedHours: 592,
    vacationHours: 0,
    sickLeaveHours: 16,
    personalLeaveHours: 0,
    seniorityAdjustment: 16,
    remainingHours: 1076,
  },
  {
    userId: "3", // Elena Sánchez
    year: 2025,
    baseHours: 1700,
    workedHours: 510,
    vacationHours: 64,
    sickLeaveHours: 24,
    personalLeaveHours: 16,
    seniorityAdjustment: 40,
    remainingHours: 1046,
    specialCircumstances: {
      id: uuidv4(),
      userId: "3",
      hasReducedWorkday: true,
      reductionPercentage: 20,
      hasBreastfeedingPermit: false,
      otherPermits: [
        {
          type: "Cuidado familiar",
          startDate: new Date(2025, 0, 15),
          endDate: new Date(2025, 11, 31),
          description: "Reducción por cuidado de familiar dependiente"
        }
      ]
    } as SpecialCircumstances
  }
];
