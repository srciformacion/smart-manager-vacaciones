
import { WorkGroup, Request, User, Balance } from '@/types';

// Comprueba si una fecha es día de descanso semanal
function isWeeklyRestDay(date: Date, user: User): boolean {
  // Implementación simplificada
  // En un caso real, se obtendría esta información de una tabla de turnos o calendario
  const day = date.getDay(); // 0 = domingo, 1 = lunes, etc.
  
  // Supongamos que sabemos los días de descanso por tipo de turno
  // Esta es una implementación muy simplificada
  if (user.shift === 'Localizado') {
    return day === 0 || day === 6; // Sábado y domingo
  } else if (user.shift === 'Urgente 24h') {
    // Los turnos de 24h pueden tener patrones más complejos
    return false; // Se necesitaría una lógica más compleja
  }
  
  // Por defecto, asumimos que los fines de semana son descanso
  return day === 0 || day === 6;
}

// Verifica si una solicitud de vacaciones es válida según las reglas
export function validateVacationRequest(
  startDate: Date,
  endDate: Date,
  user: User,
  existingRequests: Request[]
): { valid: boolean; message: string } {
  
  // Validación 1: No puede iniciarse en día de descanso semanal
  if (isWeeklyRestDay(startDate, user)) {
    return {
      valid: false,
      message: 'Las vacaciones no pueden iniciarse en un día de descanso semanal (salvo pacto)'
    };
  }
  
  // Validación 2: Verificar que las fechas cumplen con la lógica del grupo
  const isValidForGroup = validateDatesForWorkGroup(startDate, endDate, user.workGroup);
  if (!isValidForGroup.valid) {
    return isValidForGroup;
  }
  
  // Validación 3: No debe solaparse con otras solicitudes existentes
  const overlaps = existingRequests.some(request => {
    // Solo comprobamos solicitudes aprobadas o pendientes
    if (request.status === 'rejected') return false;
    
    const requestStart = new Date(request.startDate);
    const requestEnd = new Date(request.endDate);
    
    // Comprobamos si hay solapamiento
    return (
      (startDate >= requestStart && startDate <= requestEnd) || // La nueva fecha de inicio está dentro de una solicitud existente
      (endDate >= requestStart && endDate <= requestEnd) || // La nueva fecha de fin está dentro de una solicitud existente
      (startDate <= requestStart && endDate >= requestEnd) // La nueva solicitud engloba completamente a una existente
    );
  });
  
  if (overlaps) {
    return {
      valid: false,
      message: 'Las fechas solicitadas se solapan con otra solicitud existente'
    };
  }

  // Validación 4: No debe solapar con baja médica (IT) o permiso especial
  // En un sistema real, verificaríamos contra una base de datos de bajas médicas
  const hasOverlappingMedicalLeave = false; // Implementación simplificada
  
  if (hasOverlappingMedicalLeave) {
    return {
      valid: false,
      message: 'Las fechas solicitadas coinciden con un periodo de baja médica o permiso especial'
    };
  }
  
  return { valid: true, message: 'Solicitud válida' };
}

// Valida que las fechas cumplan con las reglas del grupo de trabajo
export function validateDatesForWorkGroup(
  startDate: Date,
  endDate: Date,
  workGroup: WorkGroup
): { valid: boolean; message: string } {
  
  // Calcular la duración en días
  const durationInDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  switch (workGroup) {
    case 'Grupo Localizado':
      // Quincenas naturales
      const isQuincena = (
        startDate.getDate() === 1 && endDate.getDate() === 15 ||
        startDate.getDate() === 16 && (
          endDate.getDate() === 30 ||
          endDate.getDate() === 31 ||
          (endDate.getMonth() === 1 && endDate.getDate() === 28) || // Febrero
          (endDate.getMonth() === 1 && endDate.getDate() === 29) // Febrero en año bisiesto
        )
      );
      
      if (!isQuincena) {
        return {
          valid: false,
          message: 'Las vacaciones para Grupo Localizado deben ser en quincenas naturales (1-15 o 16-fin de mes)'
        };
      }
      break;
      
    case 'Grupo Programado':
      // Semanas naturales (lunes a domingo) + bloque de 4 días
      const isMonday = startDate.getDay() === 1;
      const isSunday = endDate.getDay() === 0;
      const isWeek = isMonday && isSunday && durationInDays === 7;
      const isFourDayBlock = durationInDays === 4;
      
      if (!isWeek && !isFourDayBlock) {
        return {
          valid: false,
          message: 'Las vacaciones para Grupo Programado deben ser semanas naturales (lunes a domingo) o un bloque de 4 días'
        };
      }
      break;
      
    case 'Urgente 24h':
      // Tres bloques de guardias (2/3/2) o 32 días regulables
      if (durationInDays !== 2 && durationInDays !== 3 && durationInDays !== 32) {
        return {
          valid: false,
          message: 'Las vacaciones para Urgente 24h deben ser bloques de 2 o 3 días, o un bloque de 32 días'
        };
      }
      break;
      
    case 'Urgente 12h':
      // Quincenas naturales (igual que Grupo Localizado)
      const isQuincenaN = (
        startDate.getDate() === 1 && endDate.getDate() === 15 ||
        startDate.getDate() === 16 && (
          endDate.getDate() === 30 ||
          endDate.getDate() === 31 ||
          (endDate.getMonth() === 1 && endDate.getDate() === 28) || // Febrero
          (endDate.getMonth() === 1 && endDate.getDate() === 29) // Febrero en año bisiesto
        )
      );
      
      if (!isQuincenaN) {
        return {
          valid: false,
          message: 'Las vacaciones para Urgente 12h deben ser en quincenas naturales (1-15 o 16-fin de mes)'
        };
      }
      break;
      
    case 'GES Sala Sanitaria':
      // Tres bloques (10/10/12)
      if (durationInDays !== 10 && durationInDays !== 12) {
        return {
          valid: false,
          message: 'Las vacaciones para GES Sala Sanitaria deben ser bloques de 10 o 12 días'
        };
      }
      break;
      
    case 'Top Programado':
      // Semanas naturales + bloque de 4 días (igual que Grupo Programado)
      const isMon = startDate.getDay() === 1;
      const isSun = endDate.getDay() === 0;
      const isWeekBlock = isMon && isSun && durationInDays === 7;
      const is4DayBlock = durationInDays === 4;
      
      if (!isWeekBlock && !is4DayBlock) {
        return {
          valid: false,
          message: 'Las vacaciones para Top Programado deben ser semanas naturales (lunes a domingo) o un bloque de 4 días'
        };
      }
      break;
      
    case 'Grupo 1/3':
      // Quincenas naturales (igual que Grupo Localizado y Urgente 12h)
      const isQuincenaGroup = (
        startDate.getDate() === 1 && endDate.getDate() === 15 ||
        startDate.getDate() === 16 && (
          endDate.getDate() === 30 ||
          endDate.getDate() === 31 ||
          (endDate.getMonth() === 1 && endDate.getDate() === 28) || // Febrero
          (endDate.getMonth() === 1 && endDate.getDate() === 29) // Febrero en año bisiesto
        )
      );
      
      if (!isQuincenaGroup) {
        return {
          valid: false,
          message: 'Las vacaciones para Grupo 1/3 deben ser en quincenas naturales (1-15 o 16-fin de mes)'
        };
      }
      break;
  }
  
  return { valid: true, message: 'Fechas válidas para el grupo de trabajo' };
}

// Función para sugerir fechas alternativas
export function suggestAlternativeDates(
  startDate: Date,
  endDate: Date,
  user: User,
  existingRequests: Request[]
): Date[][] {
  // Implementación simplificada
  // En un caso real, se buscarían periodos disponibles según la lógica del grupo
  
  const suggestions: Date[][] = [];
  const durationInDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  // Generar 3 sugerencias alternativas
  for (let i = 1; i <= 3; i++) {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(newStartDate.getDate() + (7 * i)); // Intentar 1, 2 o 3 semanas después
    
    const newEndDate = new Date(newStartDate);
    newEndDate.setDate(newStartDate.getDate() + durationInDays - 1);
    
    // Verificar si esta sugerencia es válida
    const validation = validateVacationRequest(newStartDate, newEndDate, user, existingRequests);
    
    if (validation.valid) {
      suggestions.push([newStartDate, newEndDate]);
    }
  }
  
  return suggestions;
}

// Función para analizar conflictos de personal en fechas específicas
export function analyzeStaffingConflicts(
  startDate: Date,
  endDate: Date,
  department: string,
  allRequests: Request[],
  allUsers: User[]
): { hasConflict: boolean; message: string } {
  
  // Obtener todos los usuarios del mismo departamento
  const departmentUsers = allUsers.filter(user => user.department === department);
  
  // Obtener total de usuarios en el departamento
  const totalDepartmentUsers = departmentUsers.length;
  
  // Umbral de usuarios que pueden estar ausentes simultáneamente (ejemplo: 30%)
  const threshold = Math.ceil(totalDepartmentUsers * 0.3);
  
  // Contar solicitudes solapadas para cada día en el rango
  const currentDate = new Date(startDate);
  const endDateCopy = new Date(endDate);
  
  while (currentDate <= endDateCopy) {
    // Filtrar solicitudes aprobadas o pendientes que incluyen la fecha actual
    const overlappingRequests = allRequests.filter(request => {
      if (request.status === 'rejected') return false;
      
      const requestStart = new Date(request.startDate);
      const requestEnd = new Date(request.endDate);
      
      return currentDate >= requestStart && currentDate <= requestEnd;
    });
    
    // Obtener usuarios únicos con solicitudes solapadas
    const usersWithOverlapping = [...new Set(overlappingRequests.map(request => request.userId))];
    
    // Contar usuarios del mismo departamento con solicitudes solapadas
    const departmentUsersWithOverlapping = usersWithOverlapping.filter(userId => {
      const user = departmentUsers.find(u => u.id === userId);
      return user !== undefined;
    });
    
    if (departmentUsersWithOverlapping.length >= threshold) {
      const conflictDate = new Date(currentDate);
      return {
        hasConflict: true,
        message: `Posible déficit de personal el ${conflictDate.toLocaleDateString()}. Ya hay ${departmentUsersWithOverlapping.length} de ${totalDepartmentUsers} personas ausentes.`
      };
    }
    
    // Avanzar al siguiente día
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return { hasConflict: false, message: 'No se detectaron conflictos de personal' };
}

// Función para calcular días disponibles (considerando antigüedad)
export function calculateAvailableDays(user: User, balance: Balance): Balance {
  // Copia del balance para no modificar el original
  const updatedBalance = { ...balance };
  
  // Ajustar días de vacaciones según antigüedad
  const baseVacationDays = 22; // Días base según convenio
  
  // Por cada 5 años de antigüedad, se añade 1 día adicional (ajustar según convenio real)
  const additionalVacationDays = Math.floor(user.seniority / 5);
  
  updatedBalance.vacationDays = baseVacationDays + additionalVacationDays;
  
  // Ajustar días de asuntos propios según antigüedad
  let personalDays = 3; // Base de 3 días por convenio
  
  // Si tiene más de 15 años, sumar horas extra
  if (user.seniority >= 25) {
    personalDays += 2; // 2 días adicionales para >25 años
  } else if (user.seniority >= 15) {
    personalDays += 1; // 1 día adicional para >15 años
  }
  
  updatedBalance.personalDays = personalDays;
  
  return updatedBalance;
}

// Validar solicitud de día de asuntos propios
export function validatePersonalDayRequest(
  date: Date,
  user: User,
  allRequests: Request[],
  allUsers: User[]
): { valid: boolean; message: string } {
  // Verificar si no se supera el 10% del personal de su categoría ese día
  const sameDepUsers = allUsers.filter(u => u.department === user.department);
  const totalDepartmentUsers = sameDepUsers.length;
  
  // Obtener solicitudes para ese día y departamento
  const sameDepRequests = allRequests.filter(req => {
    // Solo considerar solicitudes aprobadas o pendientes
    if (req.status === 'rejected') return false;
    
    // Verificar si la solicitud es para el mismo día y es un asunto propio o vacaciones
    const reqDate = new Date(req.startDate);
    return (
      reqDate.getFullYear() === date.getFullYear() &&
      reqDate.getMonth() === date.getMonth() &&
      reqDate.getDate() === date.getDate() &&
      (req.type === 'personalDay' || req.type === 'vacation')
    );
  });
  
  // Calcular cuántos usuarios del mismo departamento tienen solicitudes para ese día
  const usersWithRequestsForDay = sameDepRequests
    .map(req => req.userId)
    .filter(userId => {
      const user = allUsers.find(u => u.id === userId);
      return user && user.department === user.department;
    });
  
  // Eliminar duplicados
  const uniqueUsers = [...new Set(usersWithRequestsForDay)];
  
  // Calcular porcentaje
  const percentageAbsent = (uniqueUsers.length / totalDepartmentUsers) * 100;
  
  if (percentageAbsent >= 10) {
    return {
      valid: false,
      message: `No se puede aprobar su solicitud porque ya hay un ${Math.round(percentageAbsent)}% del personal de su departamento ausente ese día (máximo permitido: 10%)`
    };
  }
  
  // Verificar que el bloque horario es válido (8h, 12h, o 24h)
  // Esta validación depende del turno y la jornada del usuario
  // Implementación simplificada
  
  return { valid: true, message: 'Solicitud válida' };
}

// Validar solicitud de cambio de turno
export function validateShiftChangeRequest(
  requestedDate: Date,
  replacement: User, // Usuario con quien se intercambia el turno
  user: User,
  allRequests: Request[]
): { valid: boolean; message: string } {
  // Verificar que sea con función equivalente
  if (user.department !== replacement.department) {
    return {
      valid: false,
      message: 'El cambio de turno debe ser con un compañero del mismo departamento'
    };
  }
  
  // Verificar que se respete el descanso mínimo legal (12 horas entre jornadas)
  // Implementación simplificada que asume que ya tenemos los turnos registrados
  const hasMinimumRest = true; // En un sistema real, verificaríamos contra los turnos existentes
  
  if (!hasMinimumRest) {
    return {
      valid: false,
      message: 'El cambio solicitado no respeta el descanso mínimo legal de 12 horas entre jornadas'
    };
  }
  
  // Verificar que el reemplazo no tiene ya una solicitud para ese día
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
