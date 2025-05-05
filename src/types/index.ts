
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
  | "Sunday";

export type WorkGroup = 
  | "A" 
  | "B" 
  | "C" 
  | "D" 
  | "E" 
  | "F" 
  | "Grupo Programado"
  | "Urgente 24h"
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
  shiftType: ShiftType[];
  startTime: string;
  endTime: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationPayload {
  userId: string;
  title: string;
  message: string;
  type?: NotificationType;
  channel: NotificationChannel[];
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
}
