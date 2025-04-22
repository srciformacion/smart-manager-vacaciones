
import { ShiftType, WorkdayType, Department, WorkGroup } from '@/types';

// Función para asignar automáticamente el grupo de trabajo según las reglas
export function assignWorkGroup(
  shift: ShiftType,
  workday: WorkdayType,
  department: Department
): WorkGroup {
  
  // Reglas de asignación basadas en los datos proporcionados
  
  // Turno Localizado siempre va al Grupo Localizado
  if (shift === 'Localizado') {
    return 'Grupo Localizado';
  }
  
  // Turnos de urgencias
  if (shift === 'Urgente 24h') {
    return 'Urgente 24h';
  }
  
  if (shift === 'Urgente 12h') {
    return 'Urgente 12h';
  }
  
  // GES Sala Sanitaria
  if (shift === 'GES Sala Sanitaria') {
    return 'GES Sala Sanitaria';
  }
  
  // Top Programado
  if (shift === 'Top Programado') {
    return 'Top Programado';
  }
  
  // Grupo 1/3
  if (shift === 'Grupo 1/3') {
    return 'Grupo 1/3';
  }
  
  // Por defecto, asignar a Grupo Programado
  return 'Grupo Programado';
}

// Función para obtener las reglas de vacaciones según el grupo
export function getVacationRules(workGroup: WorkGroup): string {
  switch (workGroup) {
    case 'Grupo Localizado':
      return 'Quincenas Naturales';
    case 'Grupo Programado':
      return 'Semanas naturales (lunes a domingo) + bloque de 4 días';
    case 'Urgente 24h':
      return 'Tres bloques de guardias (2/3/2) o 32 días regulables';
    case 'Urgente 12h':
      return 'Quincenas Naturales';
    case 'GES Sala Sanitaria':
      return 'Tres bloques (10/10/12)';
    case 'Top Programado':
      return 'Semanas naturales + bloque de 4 días';
    case 'Grupo 1/3':
      return 'Quincenas Naturales';
    default:
      return 'Consultar con RRHH';
  }
}
