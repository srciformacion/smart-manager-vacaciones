
import { User, Request, Balance, WorkGroup } from '@/types';

export interface OverlapAlert {
  userId: string;
  userName: string;
  department: string;
  requestId: string;
  startDate: Date;
  endDate: Date;
  overlapType: string;
  description: string;
  message: string;
}

export interface GroupCrowdingAlert {
  workGroup: WorkGroup;
  department: string;
  startDate: Date;
  endDate: Date;
  date: Date;
  count: number;
  absenceCount: number;
  totalWorkers: number;
  absencePercentage: number;
  riskLevel: string;
  message: string;
}

export interface PermissionAccumulationAlert {
  userId: string;
  userName: string;
  department: string;
  month: number;
  count: number;
  pendingCount: number;
  totalDays: number;
  lastPermissionDate: Date;
  message: string;
}

export interface VacationLimitAlert {
  userId: string;
  userName: string;
  daysLeft: number;
  pendingDays: number;
  expiryDate: Date;
  daysUntilExpiry: number;
  message: string;
}

export interface SmartAssistantAnalysis {
  overlaps: OverlapAlert[];
  groupCrowding: GroupCrowdingAlert[];
  permissionAccumulation: PermissionAccumulationAlert[];
  vacationLimit: VacationLimitAlert[];
}
