import { User, Request, WorkGroup, Balance } from "@/types";
import { calculateAvailableDays } from "./vacation/balance";

export const validateDatesForWorkGroup = (
  startDate: Date,
  endDate: Date,
  workGroup: WorkGroup
): { valid: boolean; message?: string } => {
  if (!startDate || !endDate) {
    return { valid: false, message: "Fechas inválidas" };
  }

  switch (workGroup) {
    case 'Grupo Localizado':
    case 'Urgente 12h':
    case 'Grupo 1/3':
      // Solo permitir seleccionar desde el 1 o el 16 de cada mes
      const day = startDate.getDate();
      if (day !== 1 && day !== 16) {
        return {
          valid: false,
          message: "Las vacaciones deben comenzar el día 1 o 16 del mes"
        };
      }
      break;
    case 'Grupo Programado':
    case 'Top Programado':
      // Solo permitir seleccionar desde el lunes
      if (startDate.getDay() !== 1) {
        return {
          valid: false,
          message: "Las vacaciones deben comenzar en lunes"
        };
      }
      break;
  }

  return { valid: true };
};

export const getVacationRules = (workGroup: WorkGroup): string => {
  switch (workGroup) {
    case 'Grupo Localizado':
    case 'Urgente 12h':
    case 'Grupo 1/3':
      return "Las vacaciones deben comenzar el día 1 o 16 del mes";
    case 'Grupo Programado':
    case 'Top Programado':
      return "Las vacaciones deben comenzar en lunes";
    default:
      return "No hay restricciones especiales para las fechas de vacaciones";
  }
};

export const validateVacationRequest = (
  startDate: Date,
  endDate: Date,
  user: User,
  requests: Request[]
): { valid: boolean; message?: string } => {
  const groupValidation = validateDatesForWorkGroup(startDate, endDate, user.workGroup as WorkGroup);
  if (!groupValidation.valid) {
    return groupValidation;
  }

  const hasOverlap = requests.some(req => {
    if (req.userId === user.id && req.status !== 'rejected') {
      const reqStartDate = new Date(req.startDate);
      const reqEndDate = new Date(req.endDate);
      
      return (
        (startDate <= reqEndDate && endDate >= reqStartDate)
      );
    }
    return false;
  });

  if (hasOverlap) {
    return {
      valid: false,
      message: "Ya tiene una solicitud aprobada o pendiente para estas fechas"
    };
  }

  return { valid: true };
};

export const suggestAlternativeDates = (
  startDate: Date,
  endDate: Date,
  user: User,
  requests: Request[]
): [Date, Date][] => {
  const alternatives: [Date, Date][] = [];
  const duration = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  if (user.workGroup === 'Grupo Programado' || user.workGroup === 'Top Programado') {
    for (let i = 0; i < 4; i++) {
      const newStartDate = new Date(startDate);
      while (newStartDate.getDay() !== 1) {
        newStartDate.setDate(newStartDate.getDate() + 1);
      }
      newStartDate.setDate(newStartDate.getDate() + (i * 7));
      
      const newEndDate = new Date(newStartDate);
      newEndDate.setDate(newEndDate.getDate() + duration - 1);
      
      const validation = validateVacationRequest(newStartDate, newEndDate, user, requests);
      if (validation.valid) {
        alternatives.push([new Date(newStartDate), new Date(newEndDate)]);
      }
    }
  } else if (['Grupo Localizado', 'Urgente 12h', 'Grupo 1/3'].includes(user.workGroup as string)) {
    const dates = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 3; i++) {
      const year = currentDate.getFullYear();
      let month = currentDate.getMonth() + i;
      let yearOffset = 0;
      
      if (month > 11) {
        month = month % 12;
        yearOffset = Math.floor((currentDate.getMonth() + i) / 12);
      }
      
      dates.push(new Date(year + yearOffset, month, 1));
      dates.push(new Date(year + yearOffset, month, 16));
    }
    
    dates.sort((a, b) => a.getTime() - b.getTime());
    
    const futureDates = dates.filter(date => date >= new Date());
    
    for (const date of futureDates) {
      const newStartDate = new Date(date);
      const newEndDate = new Date(newStartDate);
      newEndDate.setDate(newEndDate.getDate() + duration - 1);
      
      const validation = validateVacationRequest(newStartDate, newEndDate, user, requests);
      if (validation.valid) {
        alternatives.push([new Date(newStartDate), new Date(newEndDate)]);
        if (alternatives.length >= 3) break;
      }
    }
  }
  
  return alternatives;
};

export const validatePersonalDayRequest = (
  date: Date,
  user: User,
  requests: Request[],
  allUsers: User[]
): { valid: boolean; message?: string } => {
  const hasOverlap = requests.some(req => {
    if (req.userId === user.id && req.status !== 'rejected') {
      const reqDate = new Date(req.startDate);
      
      return (
        reqDate.getDate() === date.getDate() &&
        reqDate.getMonth() === date.getMonth() &&
        reqDate.getFullYear() === date.getFullYear()
      );
    }
    return false;
  });

  if (hasOverlap) {
    return {
      valid: false,
      message: "Ya tiene una solicitud aprobada o pendiente para este día"
    };
  }

  const departmentUsers = allUsers.filter(u => u.department === user.department);
  const totalDepartmentUsers = departmentUsers.length;
  
  const departmentRequests = requests.filter(req => {
    const requestUser = allUsers.find(u => u.id === req.userId);
    
    if (requestUser && requestUser.department === user.department && req.status !== 'rejected') {
      const reqDate = new Date(req.startDate);
      return (
        reqDate.getDate() === date.getDate() &&
        reqDate.getMonth() === date.getMonth() &&
        reqDate.getFullYear() === date.getFullYear()
      );
    }
    return false;
  });
  
  const absentUsers = departmentRequests.length;
  const maxAbsent = Math.floor(totalDepartmentUsers * 0.1);
  
  if (absentUsers >= maxAbsent) {
    return {
      valid: false,
      message: `Ya hay un ${(absentUsers / totalDepartmentUsers * 100).toFixed(0)}% del departamento ausente en esta fecha (máximo 10%)`
    };
  }

  return { valid: true };
};

export const validateShiftChangeRequest = (
  startDate: Date,
  returnDate: Date,
  user: User,
  replacementUserId: string,
  requests: Request[],
  allUsers: User[]
): { valid: boolean; message?: string } => {
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
    if ((req.userId === user.id || req.userId === replacementUserId) && req.status !== 'rejected') {
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
    if (req.userId === replacementUserId && req.status !== 'rejected') {
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

  const replacementUser = allUsers.find(u => u.id === replacementUserId);
  
  if (!replacementUser) {
    return {
      valid: false,
      message: "No se encontró al usuario de reemplazo"
    };
  }
  
  if (replacementUser.department !== user.department) {
    return {
      valid: false,
      message: "El compañero de reemplazo debe ser del mismo departamento"
    };
  }
  
  if (replacementUser.shift !== user.shift) {
    return {
      valid: false,
      message: "El compañero de reemplazo debe tener el mismo turno"
    };
  }

  return { valid: true };
};

export { calculateAvailableDays };
