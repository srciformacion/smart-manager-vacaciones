
import { User, Request, Balance, WorkGroup } from '@/types';

export interface OverlapAlert {
  userId: string;
  message: string;
}

export interface GroupCrowdingAlert {
  workGroup: WorkGroup;
  startDate: Date;
  endDate: Date;
  count: number;
  message: string;
}

export interface PermissionAccumulationAlert {
  userId: string;
  month: number;
  count: number;
  message: string;
}

export interface VacationLimitAlert {
  userId: string;
  daysLeft: number;
  message: string;
}

export interface SmartAssistantAnalysis {
  overlaps: OverlapAlert[];
  groupCrowding: GroupCrowdingAlert[];
  permissionAccumulation: PermissionAccumulationAlert[];
  vacationLimit: VacationLimitAlert[];
}
