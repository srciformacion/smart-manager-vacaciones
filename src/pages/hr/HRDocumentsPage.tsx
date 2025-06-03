
import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { DetailedRequestView } from "@/components/hr/detailed-request-view";
import { ManagementContent } from "@/components/hr/management/management-content";
import { useRequests } from "@/hooks/use-requests";
import { useRequestManagement } from "@/hooks/hr/use-request-management";
import { useProfileAuth } from "@/hooks/profile/useProfileAuth";
import { exampleWorkers } from "@/data/example-users";
import { exampleRequests } from "@/data/example-requests";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilePen } from "lucide-react";
import { Link } from "react-router-dom";
import { RequestStatus } from "@/types";

export default function HRDocumentsPage() {
  const [activeTab, setActiveTab] = useState("solicitudes");
  const { user } = useProfileAuth();
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
    <MainLayout user={user}>
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Documentos y solicitudes</h1>
              <p className="text-muted-foreground mt-2">
                Gestione solicitudes, documentos y certificados del personal. 
                Cada solicitud muestra el trabajador que la generó.
              </p>
            </div>
            <div>
              <Button asChild>
                <Link to="/rrhh/management" className="flex items-center gap-2">
                  <FilePen size={16} />
                  <span>Gestión de solicitudes</span>
                </Link>
              </Button>
            </div>
          </div>

          <ManagementContent
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            requests={requests}
            workers={exampleWorkers}
            onViewDetails={handleViewRequestDetails}
            onStatusChange={handleStatusChange}
            onDownloadAttachment={handleDownloadAttachment}
            showWorkerInfo={true}
          />
        </div>
      )}
    </MainLayout>
  );
}
