
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApprovalStep } from "@/types/approval";
import { Request, User } from "@/types";
import { Clock, AlertTriangle, Eye } from "lucide-react";

interface PendingApprovalsWidgetProps {
  pendingSteps: ApprovalStep[];
  requests: Request[];
  users: User[];
  onViewRequest: (requestId: string) => void;
}

export function PendingApprovalsWidget({ 
  pendingSteps, 
  requests, 
  users, 
  onViewRequest 
}: PendingApprovalsWidgetProps) {
  const getRequestInfo = (stepId: string) => {
    const step = pendingSteps.find(s => s.id === stepId);
    if (!step) return null;
    
    const request = requests.find(r => r.id === step.requestId);
    const user = request ? users.find(u => u.id === request.userId) : null;
    
    return { step, request, user };
  };

  const getUrgencyLevel = (step: ApprovalStep) => {
    if (!step.dueDate) return "normal";
    
    const now = new Date();
    const timeLeft = step.dueDate.getTime() - now.getTime();
    const hoursLeft = timeLeft / (1000 * 60 * 60);
    
    if (step.escalated || hoursLeft < 0) return "overdue";
    if (hoursLeft < 24) return "urgent";
    if (hoursLeft < 48) return "soon";
    return "normal";
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "overdue":
        return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />Vencido</Badge>;
      case "urgent":
        return <Badge variant="secondary" className="bg-orange-500"><Clock className="w-3 h-3 mr-1" />Urgente</Badge>;
      case "soon":
        return <Badge variant="secondary" className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" />Próximo</Badge>;
      default:
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Normal</Badge>;
    }
  };

  const handleViewRequest = (requestId: string) => {
    console.log("Viewing request:", requestId);
    onViewRequest(requestId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Aprobaciones Pendientes</span>
          <Badge variant="secondary">{pendingSteps.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pendingSteps.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No hay aprobaciones pendientes
          </p>
        ) : (
          <div className="space-y-3">
            {pendingSteps.map((step) => {
              const info = getRequestInfo(step.id);
              if (!info?.request || !info?.user) return null;
              
              const urgency = getUrgencyLevel(step);
              
              return (
                <div key={step.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{info.user.name}</span>
                      {getUrgencyBadge(urgency)}
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewRequest(info.request!.id)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
                    </Button>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-1">
                    {info.request.type === "vacation" ? "Vacaciones" :
                     info.request.type === "personalDay" ? "Día Personal" :
                     info.request.type === "leave" ? "Baja" : "Cambio de Turno"}
                  </div>
                  
                  <div className="text-sm">
                    {info.request.startDate.toLocaleDateString()} - {info.request.endDate.toLocaleDateString()}
                  </div>
                  
                  {step.dueDate && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Vence: {step.dueDate.toLocaleString()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
