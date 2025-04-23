
// Tipos de usuario
export type UserRole = 'worker' | 'hr';

// Tipos de turnos
export type ShiftType = 
  | 'Localizado' 
  | 'Urgente 24h' 
  | 'Urgente 12h' 
  | 'GES Sala Sanitaria' 
  | 'Top Programado' 
  | 'Grupo 1/3'
  | 'Programado';

// Tipos de jornada
export type WorkdayType = 'Completa' | 'Parcial' | 'Reducida';

// Grupos de trabajo
export type WorkGroup = 
  | 'Grupo Localizado'  // Quincenas naturales
  | 'Grupo Programado'  // Semanas naturales (lunes a domingo) + bloque de 4 días
  | 'Urgente 24h'       // Tres bloques de guardias (2/3/2) o 32 días regulables
  | 'Urgente 12h'       // Quincenas naturales
  | 'GES Sala Sanitaria' // Tres bloques (10/10/12)
  | 'Top Programado'    // Semanas naturales + bloque de 4 días
  | 'Grupo 1/3';        // Quincenas naturales

// Tipo de departamento o unidad
export type Department = string;

// Tipo de solicitud
export type RequestType = 'vacation' | 'personalDay' | 'leave' | 'shiftChange';

// Estado de solicitud
export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'moreInfo';

// Usuario
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  shift: ShiftType;
  workGroup: WorkGroup;
  workday: WorkdayType;
  department: Department;
  seniority: number; // Antigüedad en años
}

// Solicitud
export interface Request {
  id: string;
  userId: string;
  type: RequestType;
  startDate: Date;
  endDate: Date;
  reason?: string;
  status: RequestStatus;
  attachmentUrl?: string;
  observations?: string;
  createdAt: Date;
  updatedAt: Date;
  replacementUserId?: string; // Para solicitudes de cambio de turno
  returnDate?: Date; // Fecha propuesta para devolver el turno
}

// Saldo de días
export interface Balance {
  id: string;
  userId: string;
  vacationDays: number;
  personalDays: number;
  leaveDays: number;
  year: number;
}
