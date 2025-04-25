
import { SpecialCircumstances } from '@/types/calendar';
import { v4 as uuidv4 } from 'uuid';

// Example special circumstances data
export const exampleSpecialCircumstances: SpecialCircumstances[] = [
  {
    id: uuidv4(),
    userId: "3", // Elena Sánchez
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
  }
];
