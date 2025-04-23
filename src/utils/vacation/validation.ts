
import { Request, User, WorkGroup } from "@/types";
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
  startDate: Date,
  returnDate: Date,
  replacement: User,
  user: User,
  requests: Request[],
  currentDate: Date
): { valid: boolean; message: string } {
  if (returnDate <= startDate) {
    return {
      valid: false,
      message: "La fecha de devolución debe ser posterior a la fecha del cambio"
    };
  }

  const hasUserOverlap = requests.some(req => {
    if (req.userId === user.id && req.status !== 'rejected') {
      const reqDate = new Date(req.startDate);
      
      return (
        reqDate.getDate() === startDate.getDate() &&
        reqDate.getMonth() === startDate.getMonth() &&
        reqDate.getFullYear() === startDate.getFullYear()
      );
    }
    return false;
  });

  if (hasUserOverlap) {
    return {
      valid: false,
      message: "Ya tiene una solicitud aprobada o pendiente para este día"
    };
  }

  const hasReturnOverlap = requests.some(req => {
    if ((req.userId === user.id || req.userId === replacement.id) && req.status !== 'rejected') {
      const reqDate = new Date(req.startDate);
      
      return (
        reqDate.getDate() === returnDate.getDate() &&
        reqDate.getMonth() === returnDate.getMonth() &&
        reqDate.getFullYear() === returnDate.getFullYear()
      );
    }
    return false;
  });

  if (hasReturnOverlap) {
    return {
      valid: false,
      message: "Ya existe una solicitud para la fecha de devolución"
    };
  }

  const hasReplacementOverlap = requests.some(req => {
    if (req.userId === replacement.id && req.status !== 'rejected') {
      const reqDate = new Date(req.startDate);
      
      return (
        reqDate.getDate() === startDate.getDate() &&
        reqDate.getMonth() === startDate.getMonth() &&
        reqDate.getFullYear() === startDate.getFullYear()
      );
    }
    return false;
  });

  if (hasReplacementOverlap) {
    return {
      valid: false,
      message: "El compañero de reemplazo ya tiene una solicitud para esta fecha"
    };
  }
  
  if (replacement.department !== user.department) {
    return {
      valid: false,
      message: "El compañero de reemplazo debe ser del mismo departamento"
    };
  }
  
  if (replacement.shift !== user.shift) {
    return {
      valid: false,
      message: "El compañero de reemplazo debe tener el mismo turno"
    };
  }

  return { valid: true, message: 'Solicitud válida' };
}
