
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PendingApprovalsWidget } from "@/components/hr/approval/pending-approvals-widget";
import { RequestList } from "@/components/requests/request-list";
import { ApprovalWorkflowView } from "@/components/hr/approval/approval-workflow-view";
import { Request, RequestStatus, User } from "@/types";
import { ApprovalStep, ApprovalWorkflow } from "@/types/approval";

interface HRRequestsTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingApprovals: ApprovalStep[];
  requests: Request[];
  users: User[];
  selectedRequest: Request | null;
  selectedWorkflow: ApprovalWorkflow | null;
  userId: string | null;
  onViewRequestFromWidget: (requestId: string) => void;
  onViewDetails: (request: Request) => void;
  onStatusChange: (request: Request, newStatus: RequestStatus) => void;
  onDownloadAttachment: (request: Request) => void;
  onProcessApproval: (stepId: string, action: "approve" | "reject" | "request_info", comments?: string) => void;
}

export function HRRequestsTabs({
  activeTab,
  setActiveTab,
  pendingApprovals,
  requests,
  users,
  selectedRequest,
  selectedWorkflow,
  userId,
  onViewRequestFromWidget,
  onViewDetails,
  onStatusChange,
  onDownloadAttachment,
  onProcessApproval
}: HRRequestsTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList>
        <TabsTrigger value="pending-approvals">Aprobaciones Pendientes ({pendingApprovals.length})</TabsTrigger>
        <TabsTrigger value="all-requests">Todas las Solicitudes</TabsTrigger>
        {selectedRequest && <TabsTrigger value="workflow">Flujo de Aprobación</TabsTrigger>}
      </TabsList>
      
      <TabsContent value="pending-approvals">
        <PendingApprovalsWidget
          pendingSteps={pendingApprovals}
          requests={requests}
          users={users}
          onViewRequest={onViewRequestFromWidget}
        />
      </TabsContent>
      
      <TabsContent value="all-requests">
        <RequestList 
          requests={requests}
          users={users}
          isHRView={true}
          onViewDetails={onViewDetails}
          onStatusChange={onStatusChange}
          onDownloadAttachment={onDownloadAttachment}
        />
      </TabsContent>
      
      {selectedRequest && selectedWorkflow && (
        <TabsContent value="workflow">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-medium">
                Solicitud de {users.find(w => w.id === selectedRequest.userId)?.name}
              </h3>
              <span className="text-muted-foreground">
                {selectedRequest.startDate.toLocaleDateString()} - {selectedRequest.endDate.toLocaleDateString()}
              </span>
            </div>
            
            <ApprovalWorkflowView
              workflow={selectedWorkflow}
              currentUserId={userId || ""}
              onProcessApproval={onProcessApproval}
            />
          </div>
        </TabsContent>
      )}
    </Tabs>
  );
}
