
import { Request, User, Balance } from '@/types';
import { SmartAssistantAnalysis } from './types';
import { OverlapAnalyzer } from './overlap-analyzer';
import { GroupCrowdingAnalyzer } from './group-crowding-analyzer';
import { PermissionAccumulationAnalyzer } from './permission-accumulation-analyzer';
import { VacationLimitAnalyzer } from './vacation-limit-analyzer';

export class SmartAssistant {
  static analyze(
    requests: Request[], 
    users: User[], 
    balances: Balance[]
  ): SmartAssistantAnalysis {
    return {
      overlaps: OverlapAnalyzer.detect(requests, users),
      groupCrowding: GroupCrowdingAnalyzer.detect(requests, users),
      permissionAccumulation: PermissionAccumulationAnalyzer.detect(requests, users),
      vacationLimit: VacationLimitAnalyzer.detect(balances, users)
    };
  }
}

// Re-export types and analyzers for convenience
export * from './types';
export * from './overlap-analyzer';
export * from './group-crowding-analyzer';
export * from './permission-accumulation-analyzer';
export * from './vacation-limit-analyzer';
