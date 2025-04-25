
export interface AIAnalysisResult {
  requestId: string;
  recommendation: "approve" | "deny" | "review";
  explanation: string;
  conflictType?: string;
  severity: "low" | "medium" | "high";
}

export interface HoursCalculationResult {
  userId: string;
  workedHours: number;
  expectedHours: number;
  difference: number;
  adjustedDifference: number;
  explanation: string;
  status: "deficit" | "balanced" | "excess";
}

export interface SimulationResult {
  success: boolean;
  conflicts: string[];
  recommendation: string;
  affectedWorkers: string[];
  scheduleCoverage: number;
}

export interface AIQueryResponse {
  answer: string;
  relatedData?: any;
  confidence: number;
}
