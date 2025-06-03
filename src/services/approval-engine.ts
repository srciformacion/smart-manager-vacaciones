
import { ApprovalRule, ApprovalStep, ApprovalWorkflow, ApprovalLevel, ApprovalPolicy } from "@/types/approval";
import { Request, User } from "@/types";

export class ApprovalEngine {
  private policies: ApprovalPolicy[] = [];

  constructor(policies: ApprovalPolicy[] = []) {
    this.policies = policies;
  }

  // Determina qué reglas de aprobación aplicar según la solicitud
  public getApplicableRules(request: Request, requestor: User): ApprovalRule[] {
    const applicableRules: ApprovalRule[] = [];

    for (const policy of this.policies) {
      if (!policy.isActive) continue;

      for (const rule of policy.rules) {
        if (this.ruleMatches(rule, request, requestor)) {
          applicableRules.push(rule);
        }
      }
    }

    return applicableRules;
  }

  // Crea un flujo de aprobación para una solicitud
  public createWorkflow(request: Request, requestor: User): ApprovalWorkflow {
    const rules = this.getApplicableRules(request, requestor);
    const steps = this.generateApprovalSteps(request, rules);

    const workflow: ApprovalWorkflow = {
      id: `workflow-${request.id}`,
      requestId: request.id,
      status: "in_progress",
      currentStep: 0,
      steps,
      createdAt: new Date(),
    };

    return workflow;
  }

  // Procesa una acción de aprobación
  public processApproval(
    workflow: ApprovalWorkflow, 
    stepId: string, 
    approverId: string, 
    action: "approve" | "reject" | "request_info",
    comments?: string
  ): ApprovalWorkflow {
    const stepIndex = workflow.steps.findIndex(step => step.id === stepId);
    if (stepIndex === -1) {
      throw new Error("Paso de aprobación no encontrado");
    }

    const step = workflow.steps[stepIndex];
    step.approverId = approverId;
    step.action = action;
    step.comments = comments;
    step.processedAt = new Date();

    switch (action) {
      case "approve":
        step.status = "approved";
        workflow = this.advanceWorkflow(workflow);
        break;
      case "reject":
        step.status = "rejected";
        workflow.status = "rejected";
        workflow.completedAt = new Date();
        break;
      case "request_info":
        step.status = "pending";
        // La solicitud vuelve al solicitante para más información
        break;
    }

    return workflow;
  }

  // Verifica si una regla se aplica a una solicitud específica
  private ruleMatches(rule: ApprovalRule, request: Request, requestor: User): boolean {
    // Verificar tipo de solicitud
    if (rule.requestType !== "all" && rule.requestType !== request.type) {
      return false;
    }

    // Verificar departamento si está especificado
    if (rule.department && rule.department !== requestor.department) {
      return false;
    }

    // Para vacaciones, verificar duración en días como "cantidad"
    if (request.type === "vacation" && (rule.minAmount || rule.maxAmount)) {
      const days = this.calculateVacationDays(request.startDate, request.endDate);
      if (rule.minAmount && days < rule.minAmount) return false;
      if (rule.maxAmount && days > rule.maxAmount) return false;
    }

    return true;
  }

  // Genera los pasos de aprobación según las reglas
  private generateApprovalSteps(request: Request, rules: ApprovalRule[]): ApprovalStep[] {
    const steps: ApprovalStep[] = [];
    const requiredLevels = new Set<ApprovalLevel>();

    // Recopilar todos los niveles requeridos
    rules.forEach(rule => {
      rule.requiredApprovers.forEach(level => requiredLevels.add(level));
    });

    // Crear pasos en orden jerárquico
    const levelOrder: ApprovalLevel[] = ["supervisor", "hr", "director", "ceo"];
    const sortedLevels = levelOrder.filter(level => requiredLevels.has(level));

    sortedLevels.forEach((level, index) => {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 3); // 3 días para aprobar

      steps.push({
        id: `step-${request.id}-${index}`,
        requestId: request.id,
        level,
        status: index === 0 ? "pending" : "pending", // El primer paso está activo
        createdAt: new Date(),
        dueDate,
      });
    });

    return steps;
  }

  // Avanza el flujo de trabajo al siguiente paso
  private advanceWorkflow(workflow: ApprovalWorkflow): ApprovalWorkflow {
    const currentStep = workflow.steps[workflow.currentStep];
    
    if (currentStep.status === "approved") {
      workflow.currentStep++;
      
      if (workflow.currentStep >= workflow.steps.length) {
        // Todos los pasos completados
        workflow.status = "completed";
        workflow.completedAt = new Date();
      }
    }

    return workflow;
  }

  // Calcula días de vacaciones
  private calculateVacationDays(startDate: Date, endDate: Date): number {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }

  // Verifica si hay pasos vencidos que necesitan escalación
  public checkEscalation(workflow: ApprovalWorkflow): ApprovalWorkflow {
    const now = new Date();
    
    workflow.steps.forEach(step => {
      if (step.status === "pending" && step.dueDate && step.dueDate < now && !step.escalated) {
        step.escalated = true;
        workflow.autoEscalated = true;
        
        // Notificar escalación
        console.log(`Escalando paso ${step.id} por vencimiento`);
      }
    });

    return workflow;
  }
}
