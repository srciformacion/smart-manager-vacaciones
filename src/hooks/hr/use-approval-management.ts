
import { useState, useEffect } from "react";
import { ApprovalWorkflow, ApprovalStep, ApprovalAction } from "@/types/approval";
import { Request, User } from "@/types";
import { ApprovalEngine } from "@/services/approval-engine";
import { defaultApprovalPolicies } from "@/data/approval-policies";
import { toast } from "sonner";

export function useApprovalManagement(requests: Request[], users: User[]) {
  const [workflows, setWorkflows] = useState<ApprovalWorkflow[]>([]);
  const [approvalEngine] = useState(() => new ApprovalEngine(defaultApprovalPolicies));

  useEffect(() => {
    // Crear workflows para solicitudes pendientes que no tengan workflow
    const pendingRequests = requests.filter(req => 
      req.status === "pending" && !workflows.find(w => w.requestId === req.id)
    );

    const newWorkflows = pendingRequests.map(request => {
      const requestor = users.find(u => u.id === request.userId);
      if (!requestor) {
        console.warn(`Usuario no encontrado para solicitud ${request.id}`);
        return null;
      }
      return approvalEngine.createWorkflow(request, requestor);
    }).filter(Boolean) as ApprovalWorkflow[];

    if (newWorkflows.length > 0) {
      setWorkflows(prev => [...prev, ...newWorkflows]);
    }
  }, [requests, users, approvalEngine]);

  const processApproval = (
    workflowId: string,
    stepId: string,
    approverId: string,
    action: ApprovalAction,
    comments?: string
  ) => {
    setWorkflows(prev => prev.map(workflow => {
      if (workflow.id === workflowId) {
        try {
          const updatedWorkflow = approvalEngine.processApproval(
            workflow, 
            stepId, 
            approverId, 
            action as "approve" | "reject" | "request_info",
            comments
          );
          
          toast.success(`Solicitud ${action === "approve" ? "aprobada" : action === "reject" ? "rechazada" : "devuelta para más información"}`);
          
          return updatedWorkflow;
        } catch (error) {
          toast.error("Error al procesar la aprobación");
          console.error(error);
          return workflow;
        }
      }
      return workflow;
    }));
  };

  const getWorkflowByRequestId = (requestId: string): ApprovalWorkflow | undefined => {
    return workflows.find(w => w.requestId === requestId);
  };

  const getPendingApprovals = (approverId: string): ApprovalStep[] => {
    const pendingSteps: ApprovalStep[] = [];
    
    workflows.forEach(workflow => {
      if (workflow.status === "in_progress") {
        const currentStep = workflow.steps[workflow.currentStep];
        if (currentStep && currentStep.status === "pending") {
          // Verificar si este aprobador puede aprobar este paso
          // Por simplicidad, asumimos que pueden aprobar su nivel
          pendingSteps.push(currentStep);
        }
      }
    });

    return pendingSteps;
  };

  const checkEscalations = () => {
    setWorkflows(prev => prev.map(workflow => 
      approvalEngine.checkEscalation(workflow)
    ));
  };

  // Verificar escalaciones cada minuto
  useEffect(() => {
    const interval = setInterval(checkEscalations, 60000);
    return () => clearInterval(interval);
  }, []);

  return {
    workflows,
    processApproval,
    getWorkflowByRequestId,
    getPendingApprovals,
    checkEscalations,
  };
}
