
import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { RequestDetails } from "@/components/requests/request-details";
import { Request, User } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationSender } from "@/components/hr/notification-sender";
import { RequestsTabContent } from "@/components/hr/requests-tab-content";
import { useRequests } from "@/hooks/use-requests";
import { exampleUser, exampleWorkers } from "@/data/example-users";
import { exampleRequests } from "@/data/example-requests";

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
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestión de solicitudes</h1>
            <p className="text-muted-foreground mt-2">
              Administre todas las solicitudes de los trabajadores
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="solicitudes">Solicitudes</TabsTrigger>
              <TabsTrigger value="notificaciones">Enviar notificaciones</TabsTrigger>
            </TabsList>
            <TabsContent value="solicitudes">
              <RequestsTabContent
                requests={requests}
                workers={exampleWorkers}
                onViewDetails={handleViewRequestDetails}
                onStatusChange={handleStatusChange}
                onDownloadAttachment={handleViewRequestDetails}
              />
            </TabsContent>
            <TabsContent value="notificaciones">
              <div className="max-w-2xl mx-auto">
                <NotificationSender />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </MainLayout>
  );
}
