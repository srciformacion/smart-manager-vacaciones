
import { Request, User } from '@/types';
import { validateVacationRequest } from './validation';

export function suggestAlternativeDates(
  startDate: Date,
  endDate: Date,
  user: User,
  existingRequests: Request[]
): Date[][] {
  const suggestions: Date[][] = [];
  const durationInDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  // Generar 3 sugerencias alternativas
  for (let i = 1; i <= 3; i++) {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(newStartDate.getDate() + (7 * i));
    
    const newEndDate = new Date(newStartDate);
    newEndDate.setDate(newStartDate.getDate() + durationInDays - 1);
    
    const validation = validateVacationRequest(newStartDate, newEndDate, user, existingRequests);
    
    if (validation.valid) {
      suggestions.push([newStartDate, newEndDate]);
    }
  }
  
  return suggestions;
}
