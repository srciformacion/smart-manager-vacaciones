
import { Request, User } from '@/types';
import { isWeeklyRestDay } from './weekly-rest';
import { validateDatesForWorkGroup } from './work-group-rules';

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

  const hasOverlappingMedicalLeave = false;
  
  if (hasOverlappingMedicalLeave) {
    return {
      valid: false,
      message: 'Las fechas solicitadas coinciden con un periodo de baja médica o permiso especial'
    };
  }
  
  return { valid: true, message: 'Solicitud válida' };
}

export function validatePersonalDayRequest(
  date: Date,
  user: User,
  allRequests: Request[],
  allUsers: User[]
): { valid: boolean; message: string } {
  const sameDepUsers = allUsers.filter(u => u.department === user.department);
  const totalDepartmentUsers = sameDepUsers.length;
  
  const sameDepRequests = allRequests.filter(req => {
    if (req.status === 'rejected') return false;
    
    const reqDate = new Date(req.startDate);
    return (
      reqDate.getFullYear() === date.getFullYear() &&
      reqDate.getMonth() === date.getMonth() &&
      reqDate.getDate() === date.getDate() &&
      (req.type === 'personalDay' || req.type === 'vacation')
    );
  });
  
  const usersWithRequestsForDay = sameDepRequests
    .map(req => req.userId)
    .filter(userId => {
      const user = allUsers.find(u => u.id === userId);
      return user && user.department === user.department;
    });
  
  const uniqueUsers = [...new Set(usersWithRequestsForDay)];
  const percentageAbsent = (uniqueUsers.length / totalDepartmentUsers) * 100;
  
  if (percentageAbsent >= 10) {
    return {
      valid: false,
      message: `No se puede aprobar su solicitud porque ya hay un ${Math.round(percentageAbsent)}% del personal de su departamento ausente ese día (máximo permitido: 10%)`
    };
  }
  
  return { valid: true, message: 'Solicitud válida' };
}

export function validateShiftChangeRequest(
  requestedDate: Date,
  replacement: User,
  user: User,
  allRequests: Request[]
): { valid: boolean; message: string } {
  if (user.department !== replacement.department) {
    return {
      valid: false,
      message: 'El cambio de turno debe ser con un compañero del mismo departamento'
    };
  }
  
  const hasMinimumRest = true;
  
  if (!hasMinimumRest) {
    return {
      valid: false,
      message: 'El cambio solicitado no respeta el descanso mínimo legal de 12 horas entre jornadas'
    };
  }
  
  const replacementHasRequest = allRequests.some(req => {
    if (req.userId !== replacement.id || req.status === 'rejected') return false;
    
    const reqDate = new Date(req.startDate);
    return (
      reqDate.getFullYear() === requestedDate.getFullYear() &&
      reqDate.getMonth() === requestedDate.getMonth() &&
      reqDate.getDate() === requestedDate.getDate()
    );
  });
  
  if (replacementHasRequest) {
    return {
      valid: false,
      message: 'El compañero seleccionado ya tiene otra solicitud para ese día'
    };
  }
  
  return { valid: true, message: 'Solicitud de cambio válida' };
}
