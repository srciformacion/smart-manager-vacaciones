export type RequestType =
  | "vacation"
  | "personal-day"
  | "sick-leave"
  | "shift-change";

export type RequestStatus = "pending" | "approved" | "rejected";

export type UserRole = "worker" | "hr";

export type Department =
  | "IT"
  | "Marketing"
  | "Sales"
  | "Human Resources"
  | "Finance"
  | "Operations";

export type Shift = "Morning" | "Afternoon" | "Night";

export type WeekDay =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

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
  attachmentUrl?: string;
  startTime?: string;
  endTime?: string;
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
  startTime?: string;
  endTime?: string;
  profilePicture?: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  createdAt: Date;
  read: boolean;
}

export interface Balance {
  vacationDays: number;
  personalDays: number;
}
