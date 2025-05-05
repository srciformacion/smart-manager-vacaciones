
import { ShiftType, WorkdayType, Department, WorkGroup } from '@/types';

// Function to automatically assign work group based on rules
export function assignWorkGroup(
  shift: ShiftType,
  workday: WorkdayType,
  department: Department
): WorkGroup {
  
  // Assignment rules based on provided data
  
  // Turno Localizado always goes to Grupo Localizado
  if (shift === 'Localizado') {
    return 'Grupo Localizado';
  }
  
  // Emergency shifts
  if (shift === 'Urgente 24h') {
    return 'Urgente 24h';
  }
  
  // Check for specific shift types using string comparison
  if (String(shift) === 'Urgente 12h') {
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
  
  // Default, assign to Grupo Programado
  return 'Grupo Programado';
}

// Function to get vacation rules based on work group
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
