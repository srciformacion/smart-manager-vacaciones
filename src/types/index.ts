
export type RequestType =
  | "vacation"
  | "personal-day"
  | "sick-leave"
  | "shift-change"
  | "personalDay"
  | "leave"
  | "shiftChange";

export type RequestStatus = "pending" | "approved" | "rejected" | "moreInfo";

export type UserRole = "worker" | "hr";

export type Department =
  | "IT"
  | "Marketing"
  | "Sales"
  | "Human Resources"
  | "Finance"
  | "Operations"
  | "Recursos Humanos"
  | "Atención al cliente"
  | "Administración"
  | "Personal de movimiento"
  | "Operaciones"
  | "Centro Coordinador Programado"
  | "Urgencias y Emergencias (Transporte Urgente)";

export type Shift = 
  | "Morning" 
  | "Afternoon" 
  | "Night" 
  | "Programado"
  | "Urgente 24h"
  | "Localizado"
  | "Programado Mañana";

export type WeekDay =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday"
  | "monday"    // Adding lowercase versions to maintain compatibility
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type WorkGroup = 
  | "A" 
  | "B" 
  | "C" 
  | "D" 
  | "E" 
  | "F" 
  | "Grupo Programado"
  | "Urgente 24h"
  | "Urgente 12h" // Adding this missing option
  | "Grupo Localizado"
  | "Grupo 1/3"
  | "Top Programado";

export type ShiftType = 
  | "Fixed" 
  | "Rotating" 
  | "Flexible" 
  | "Programado"
  | "Urgente 24h"
  | "Localizado"
  | "Programado Mañana"
  | "Programado Tarde"
  | "Programado Noche"
  | "Teleoperación Turno Mañana"
  | "Teleoperación Turno Tarde"
  | "Teleoperación Turno Noche"
  | "Turno 24h";

export type WorkdayType = 
  | "Full" 
  | "Part-time" 
  | "Completa" 
  | "Parcial"
  | "Reducida";

export type NotificationType = 
  | "requestCreated" 
  | "requestApproved" 
  | "requestRejected" 
  | "requestMoreInfo";

export type NotificationChannel = "email" | "sms" | "push" | "whatsapp" | "web";

export type CalendarStatus = RequestStatus | "moreInfo";

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export interface ShiftProfile {
  id: string;
  userId: string;
  name: string;
  workDays: WeekDay[];
  shiftType: string; // Changed from ShiftType[] to string to match actual usage
  startTime: string;
  endTime: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: "trabajador" | "empresa"; // Added missing property
  isDefault?: boolean; // Added missing property
}

export interface NotificationPayload {
  userId: string;
  title: string;
  message: string;
  type?: NotificationType;
  channel: NotificationChannel[];
  // Add Spanish equivalents for backward compatibility
  canal?: NotificationChannel;
  titulo?: string;
  mensaje?: string;
  tipo?: NotificationType;
  destino?: string;
}

export interface Request {
  id: string;
  userId: string;
  type: RequestType;
  startDate: Date;
  endDate: Date;
  status: RequestStatus;
  createdAt: Date;
  updatedAt: Date;
  reason?: string;
  observations?: string;
  attachmentUrl?: string;
  startTime?: string;
  endTime?: string;
  replacementUserId?: string;
}

export interface User {
  id: string;
  name: string;
  surname?: string;
  email: string;
  role: UserRole;
  department?: Department;
  shift?: Shift;
  position?: string;
  workDays?: WeekDay[];
  workday?: string;
  workGroup?: WorkGroup;
  startTime?: string;
  endTime?: string;
  profilePicture?: string;
  avatar?: string;
  seniority?: number;
  phone?: string;
  startDate?: Date; // Added missing property
  shiftStartTime?: string; // Added missing property
  shiftEndTime?: string; // Added missing property
  workdays?: WeekDay[]; // Added missing property (lowercase version)
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  createdAt: Date;
  read: boolean;
  title?: string;
  type?: NotificationType;
}

export interface Balance {
  id?: string;
  userId?: string;
  vacationDays: number;
  personalDays: number;
  leaveDays: number;
  year?: number; // Added missing property
}
