// Tipos de usuario
export type UserRole = 'worker' | 'hr';

// Tipos de turnos - Actualizado para incluir todos los tipos usados
export type ShiftType = 
  | 'Turno 24h'
  | 'Localizado'
  | 'Programado Mañana'
  | 'Programado Tarde'
  | 'Programado Noche'
  | 'Teleoperación Turno Mañana'
  | 'Teleoperación Turno Tarde'
  | 'Teleoperación Turno Noche'
  | 'Urgente 24h'
  | 'Urgente 12h'
  | 'GES Sala Sanitaria'
  | 'Top Programado'
  | 'Grupo 1/3'
  | 'Programado';

// Tipos de jornada - Actualizado para incluir todas las variantes
export type WorkdayType = 'Completa' | 'Parcial' | 'Localizada' | 'Reducida';

// Grupos de departamento - Actualizado para incluir todos los departamentos usados
export type Department = 
  | 'Urgencias y Emergencias (Transporte Urgente)'
  | 'Transporte Sanitario Programado'
  | 'Centro Coordinador Urgente'
  | 'Centro Coordinador Programado'
  | 'Mantenimiento de Vehículos'
  | 'Logística y Almacén'
  | 'Administración y Finanzas'
  | 'Recursos Humanos'
  | 'Calidad, Seguridad y Prevención de Riesgos Laborales'
  | 'Formación'
  | 'Atención al cliente'
  | 'Operaciones'
  | 'Administración'
  | 'Personal de movimiento';

// Tipo de solicitud
export type RequestType = 'vacation' | 'personalDay' | 'leave' | 'shiftChange';

// Estado de solicitud
export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'moreInfo';

// Días de la semana
export type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

// Usuario
export interface User {
  id: string;
  name: string;
  surname?: string; // Apellidos
  dni?: string;     // DNI
  email: string;
  role: UserRole;
  shift: ShiftType;
  workGroup: WorkGroup;
  workday: WorkdayType;
  department: Department;
  seniority: number; // Antigüedad en años
  startDate?: Date;  // Fecha de ingreso
  workdays?: WeekDay[]; // Días laborales habituales
  shiftStartTime?: string; // Hora de inicio del turno
  shiftEndTime?: string;   // Hora de fin del turno
  profileCreator?: 'trabajador' | 'empresa'; // Quien creó el perfil
}

// Solicitud
export interface Request {
  id: string;
  userId: string;
  type: RequestType;
  startDate: Date;
  endDate: Date;
  startTime?: string; // Hora de inicio, para solicitudes por horas
  endTime?: string;   // Hora de fin, para solicitudes por horas
  reason?: string;
  status: RequestStatus;
  attachmentUrl?: string;
  observations?: string;
  createdAt: Date;
  updatedAt: Date;
  replacementUserId?: string; // Para solicitudes de cambio de turno
  returnDate?: Date; // Fecha propuesta para devolver el turno
  validatedByAntiquity?: boolean; // Si se ha validado por antigüedad
  validatedByAvailability?: boolean; // Si se ha validado por disponibilidad departamental
}

// Saldo de días
export interface Balance {
  id: string;
  userId: string;
  vacationDays: number;
  personalDays: number;
  leaveDays: number;
  year: number;
  extraHoursForAntiquity?: number; // Horas extra por antigüedad
}

// Perfil de turno
export interface ShiftProfile {
  id: string;
  userId: string;
  shiftType: ShiftType;
  workDays: WeekDay[];
  startTime: string;
  endTime: string;
  createdBy: 'trabajador' | 'empresa';
  createdAt: Date;
  updatedAt: Date;
  isDefault: boolean;
}

// Disponibilidad departamental
export interface DepartmentAvailability {
  id: string;
  departmentId: string;
  date: Date;
  shiftType: ShiftType;
  totalStaff: number;
  availableStaff: number;
  maxAllowedAbsence: number; // Porcentaje máximo permitido de ausencias
}

// Historial de cambios de turno
export interface ShiftChangeHistory {
  id: string;
  requestId: string;
  userId: string;
  replacementUserId: string;
  originalDate: Date;
  returnDate: Date;
  isReturned: boolean;
  returnedAt?: Date;
}
