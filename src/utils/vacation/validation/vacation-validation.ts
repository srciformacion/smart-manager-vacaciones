
import { Request, User } from "@/types";
import { isWeeklyRestDay } from '../weekly-rest';
import { validateDatesForWorkGroup } from '../work-group-rules';

export function validateVacationRequest(
  startDate: Date,
  endDate: Date,
  user: User,
  existingRequests: Request[]
): { valid: boolean; message: string } {
  if (isWeeklyRestDay(startDate, user)) {
    return {
      valid: false,
      message: 'Las vacaciones no pueden iniciarse en un día de descanso semanal (salvo pacto)'
    };
  }
  
  const isValidForGroup = validateDatesForWorkGroup(startDate, endDate, user.workGroup);
  if (!isValidForGroup.valid) {
    return isValidForGroup;
  }
  
  const overlaps = existingRequests.some(request => {
    if (request.status === 'rejected') return false;
    
    const requestStart = new Date(request.startDate);
    const requestEnd = new Date(request.endDate);
    
    return (
      (startDate >= requestStart && startDate <= requestEnd) ||
      (endDate >= requestStart && endDate <= requestEnd) ||
      (startDate <= requestStart && endDate >= requestEnd)
    );
  });
  
  if (overlaps) {
    return {
      valid: false,
      message: 'Las fechas solicitadas se solapan con otra solicitud existente'
    };
  }

  return { valid: true, message: 'Solicitud válida' };
}
