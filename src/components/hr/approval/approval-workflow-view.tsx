
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ApprovalWorkflow, ApprovalStep } from "@/types/approval";
import { Check, X, MessageSquare, Clock, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface ApprovalWorkflowViewProps {
  workflow: ApprovalWorkflow;
  currentUserId: string;
  onProcessApproval: (stepId: string, action: "approve" | "reject" | "request_info", comments?: string) => void;
}

export function ApprovalWorkflowView({ 
  workflow, 
  currentUserId, 
  onProcessApproval 
}: ApprovalWorkflowViewProps) {
  const [comments, setComments] = useState("");
  const [selectedStep, setSelectedStep] = useState<string | null>(null);

  const getStepStatusBadge = (step: ApprovalStep) => {
    switch (step.status) {
      case "approved":
        return <Badge variant="default" className="bg-green-500"><Check className="w-3 h-3 mr-1" />Aprobado</Badge>;
      case "rejected":
        return <Badge variant="destructive"><X className="w-3 h-3 mr-1" />Rechazado</Badge>;
      case "pending":
        return step.escalated ? 
          <Badge variant="secondary" className="bg-orange-500"><AlertTriangle className="w-3 h-3 mr-1" />Escalado</Badge> :
          <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pendiente</Badge>;
      default:
        return <Badge variant="outline">En espera</Badge>;
    }
  };

  const getCurrentStep = () => {
    return workflow.steps[workflow.currentStep];
  };

  const canUserApprove = (step: ApprovalStep) => {
    return step.status === "pending" && step === getCurrentStep();
  };

  const handleAction = (stepId: string, action: "approve" | "reject" | "request_info") => {
    onProcessApproval(stepId, action, comments);
    setComments("");
    setSelectedStep(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Flujo de Aprobación</span>
          <Badge variant={workflow.status === "completed" ? "default" : "secondary"}>
            {workflow.status === "completed" ? "Completado" : 
             workflow.status === "rejected" ? "Rechazado" : 
             workflow.status === "escalated" ? "Escalado" : "En Progreso"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {workflow.steps.map((step, index) => (
          <div 
            key={step.id} 
            className={`p-4 border rounded-lg ${
              index === workflow.currentStep ? "border-primary bg-primary/5" : "border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium">
                  Nivel {index + 1}: {step.level}
                </span>
                {getStepStatusBadge(step)}
              </div>
              {step.dueDate && (
                <span className="text-sm text-muted-foreground">
                  Vence: {step.dueDate.toLocaleDateString()}
                </span>
              )}
            </div>

            {step.comments && (
              <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                <strong>Comentarios:</strong> {step.comments}
              </div>
            )}

            {step.processedAt && (
              <div className="text-xs text-muted-foreground mt-1">
                Procesado: {step.processedAt.toLocaleString()}
              </div>
            )}

            {canUserApprove(step) && (
              <div className="mt-3 space-y-3">
                <Textarea
                  placeholder="Comentarios (opcional)"
                  value={selectedStep === step.id ? comments : ""}
                  onChange={(e) => {
                    setComments(e.target.value);
                    setSelectedStep(step.id);
                  }}
                />
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleAction(step.id, "approve")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Aprobar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleAction(step.id, "reject")}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Rechazar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleAction(step.id, "request_info")}
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Pedir Info
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
