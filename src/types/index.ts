
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
  | "Personal de movimiento";

export type Shift = "Morning" | "Afternoon" | "Night" | "Programado";

export type WeekDay =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type WorkGroup = "A" | "B" | "C" | "D" | "E" | "F" | "Grupo Programado";

export type ShiftType = "Fixed" | "Rotating" | "Flexible" | "Programado";

export type WorkdayType = "Full" | "Part-time" | "Completa" | "Parcial";

export type NotificationType = 
  | "requestCreated" 
  | "requestApproved" 
  | "requestRejected" 
  | "requestMoreInfo";

export type NotificationChannel = "email" | "sms" | "push" | "whatsapp";

export type CalendarStatus = RequestStatus | "moreInfo";

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
  vacationDays: number;
  personalDays: number;
  leaveDays: number;
}

