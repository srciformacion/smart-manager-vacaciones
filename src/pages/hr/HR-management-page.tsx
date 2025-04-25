
import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { DetailedRequestView } from "@/components/hr/detailed-request-view";
import { ManagementContent } from "@/components/hr/management/management-content";
import { useRequests } from "@/hooks/use-requests";
import { useRequestManagement } from "@/hooks/hr/use-request-management";
import { exampleUser, exampleWorkers } from "@/data/example-users";
import { exampleRequests } from "@/data/example-requests";
import { RequestStatus } from "@/types";

export default function HRManagementPage() {
  const [activeTab, setActiveTab] = useState("solicitudes");
  const { requests, handleStatusChange } = useRequests(exampleRequests, exampleWorkers);
  
  const {
    selectedRequest,
    selectedWorker,
    handleViewRequestDetails,
    handleDetailStatusChange,
    handleDownloadAttachment,
    closeRequestDetails,
  } = useRequestManagement(requests, exampleWorkers);

  return (
    <MainLayout user={exampleUser}>
      {selectedRequest ? (
        <DetailedRequestView
          request={selectedRequest}
          user={selectedWorker}
          onClose={closeRequestDetails}
          onStatusChange={(request, newStatus, observations) => {
            handleDetailStatusChange(request, newStatus, observations);
          }}
          onDownloadAttachment={() => handleDownloadAttachment(selectedRequest)}
        />
      ) : (
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Panel de gestión RRHH</h1>
            <p className="text-muted-foreground mt-2">
              Gestione solicitudes, genere informes y visualice la disponibilidad del personal
            </p>
          </div>

          <ManagementContent
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            requests={requests}
            workers={exampleWorkers}
            onViewDetails={handleViewRequestDetails}
            onStatusChange={handleStatusChange}
            onDownloadAttachment={handleDownloadAttachment}
          />
        </div>
      )}
    </MainLayout>
  );
}
