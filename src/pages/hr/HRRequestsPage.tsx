
import React, { useState } from 'react';
import { MainLayout } from "@/components/layout/main-layout";
import { useProfileAuth } from "@/hooks/profile/useProfileAuth";
import { exampleUser, exampleWorkers } from "@/data/example-users";
import { useApprovalManagement } from "@/hooks/hr/use-approval-management";
import { useHRRequestsData } from "@/hooks/hr/use-hr-requests-data";
import { HRRequestsHeader } from "@/components/hr/requests/hr-requests-header";
import { HRRequestsLoading } from "@/components/hr/requests/hr-requests-loading";
import { HRRequestsError } from "@/components/hr/requests/hr-requests-error";
import { HRRequestsTabs } from "@/components/hr/requests/hr-requests-tabs";
import { Request } from "@/types";

export default function HRRequestsPage() {
  const { user, userId } = useProfileAuth();
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("pending-approvals");
  
  const {
    requests,
    loading,
    error,
    handleStatusChange,
    handleDownloadAttachment
  } = useHRRequestsData(userId);
  
  const {
    workflows,
    processApproval,
    getWorkflowByRequestId,
    getPendingApprovals,
  } = useApprovalManagement(requests, exampleWorkers);

  const pendingApprovals = getPendingApprovals(userId || "");
  
  const handleViewDetails = (request: Request) => {
    setSelectedRequestId(request.id);
  };

  const handleViewRequestFromWidget = (requestId: string) => {
    console.log("Viewing request from widget:", requestId);
    setSelectedRequestId(requestId);
    setActiveTab("workflow");
  };

  const handleProcessApproval = (stepId: string, action: "approve" | "reject" | "request_info", comments?: string) => {
    const workflow = workflows.find(w => w.steps.some(s => s.id === stepId));
    if (workflow) {
      processApproval(workflow.id, stepId, userId || "", action, comments);
    }
  };

  const selectedRequest = selectedRequestId ? requests.find(r => r.id === selectedRequestId) : null;
  const selectedWorkflow = selectedRequestId ? getWorkflowByRequestId(selectedRequestId) : null;
  
  return (
    <MainLayout user={user || exampleUser}>
      <div className="space-y-6">
        <HRRequestsHeader 
          loading={loading}
          error={error}
          pendingApprovalsCount={pendingApprovals.length}
        />
        
        {loading ? (
          <HRRequestsLoading />
        ) : error ? (
          <HRRequestsError error={error} />
        ) : (
          <HRRequestsTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            pendingApprovals={pendingApprovals}
            requests={requests}
            users={exampleWorkers}
            selectedRequest={selectedRequest}
            selectedWorkflow={selectedWorkflow}
            userId={userId}
            onViewRequestFromWidget={handleViewRequestFromWidget}
            onViewDetails={handleViewDetails}
            onStatusChange={handleStatusChange}
            onDownloadAttachment={handleDownloadAttachment}
            onProcessApproval={handleProcessApproval}
          />
        )}
      </div>
    </MainLayout>
  );
}
