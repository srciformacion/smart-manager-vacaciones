
export type ApprovalLevel = "supervisor" | "hr" | "director" | "ceo";

export type ApprovalAction = "approve" | "reject" | "request_info" | "escalate";

export interface ApprovalRule {
  id: string;
  requestType: string;
  department?: string;
  minAmount?: number;
  maxAmount?: number;
  requiredApprovers: ApprovalLevel[];
  parallelApproval?: boolean; // Si se puede aprobar en paralelo o debe ser secuencial
  escalationDays?: number; // Días para auto-escalación
}

export interface ApprovalStep {
  id: string;
  requestId: string;
  level: ApprovalLevel;
  approverId?: string;
  status: "pending" | "approved" | "rejected" | "skipped";
  action?: ApprovalAction;
  comments?: string;
  createdAt: Date;
  processedAt?: Date;
  dueDate?: Date;
  escalated?: boolean;
}

export interface ApprovalWorkflow {
  id: string;
  requestId: string;
  status: "in_progress" | "completed" | "rejected" | "escalated";
  currentStep: number;
  steps: ApprovalStep[];
  createdAt: Date;
  completedAt?: Date;
  autoEscalated?: boolean;
}

export interface ApprovalPolicy {
  id: string;
  name: string;
  description: string;
  rules: ApprovalRule[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
