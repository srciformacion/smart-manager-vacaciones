
import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { RequestDetails } from "@/components/requests/request-details";
import { Request, User } from "@/types";
import { useRequests } from "@/hooks/use-requests";
import { exampleUser, exampleWorkers } from "@/data/example-users";
import { exampleRequests } from "@/data/example-requests";
import { RequestsManagementHeader } from "@/components/hr/requests-management/header";
import { RequestsManagementTabs } from "@/components/hr/requests-management/tabs-content";

export default function RequestsManagementPage() {
  const [user] = useState<User | null>(exampleUser);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("solicitudes");
  
  const { requests, handleStatusChange } = useRequests(exampleRequests, exampleWorkers);

  const handleViewRequestDetails = (request: Request) => {
    const worker = exampleWorkers.find(w => w.id === request.userId) || null;
    setSelectedWorker(worker);
    setSelectedRequest(request);
  };

  const handleDetailStatusChange = (status: Request["status"]) => {
    if (selectedRequest) {
      handleStatusChange(selectedRequest, status);
    }
  };

  const handleDownloadAttachment = () => {
    if (selectedRequest?.attachmentUrl) {
      console.log("Descargando adjunto:", selectedRequest.attachmentUrl);
      alert("Descargando archivo justificante...");
    }
  };

  return (
    <MainLayout user={user}>
      {selectedRequest ? (
        <RequestDetails
          request={selectedRequest}
          user={selectedWorker}
          onClose={() => {
            setSelectedRequest(null);
            setSelectedWorker(null);
          }}
          onStatusChange={handleDetailStatusChange}
          onDownloadAttachment={handleDownloadAttachment}
          isHRView={true}
        />
      ) : (
        <div className="space-y-8">
          <RequestsManagementHeader 
            title="Gestión de solicitudes"
            description="Administre todas las solicitudes de los trabajadores"
          />

          <RequestsManagementTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            requests={requests}
            workers={exampleWorkers}
            onViewDetails={handleViewRequestDetails}
            onStatusChange={handleStatusChange}
            onDownloadAttachment={handleViewRequestDetails}
          />
        </div>
      )}
    </MainLayout>
  );
}
