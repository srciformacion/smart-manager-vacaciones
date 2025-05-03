
import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { exampleRequests } from "@/data/example-requests";
import { exampleUsers } from "@/data/example-users";
import { RequestStatus, Request, User } from "@/types";
import { useRequestManagement } from "@/hooks/hr/use-request-management";
import { DetailedRequestView } from "@/components/hr/detailed-request-view";
import { Header } from "@/components/hr/requests-management/header";
import { TabsContent } from "@/components/hr/requests-management/tabs-content";
import { RealtimeRequests } from "@/components/hr/requests-management/realtime-requests";
import { Tabs, TabsContent as RadixTabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RequestsManagementPage() {
  const [activeTab, setActiveTab] = useState("normal");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  const {
    selectedRequest,
    selectedWorker,
    handleViewRequestDetails,
    handleDetailStatusChange,
    handleDownloadAttachment,
    closeRequestDetails,
  } = useRequestManagement(exampleRequests, exampleUsers);

  // En un entorno de producción, estas serían solicitudes reales de la base de datos
  const requests: Request[] = exampleRequests;
  const workers: User[] = exampleUsers;

  return (
    <MainLayout>
      <Header 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
      />

      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Solicitudes</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Tabs para elegir entre vista normal o tiempo real */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="normal">Vista Normal</TabsTrigger>
                <TabsTrigger value="realtime">Tiempo Real</TabsTrigger>
              </TabsList>
              
              <RadixTabsContent value="normal">
                <TabsContent 
                  requests={requests}
                  workers={workers}
                  onViewDetails={handleViewRequestDetails}
                  onStatusChange={handleDetailStatusChange}
                  onDownloadAttachment={handleDownloadAttachment}
                />
              </RadixTabsContent>
              
              <RadixTabsContent value="realtime">
                <RealtimeRequests 
                  users={workers}
                  onViewDetails={handleViewRequestDetails}
                  onStatusChange={handleDetailStatusChange}
                  onDownloadAttachment={handleDownloadAttachment}
                />
              </RadixTabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {selectedRequest && selectedWorker && (
        <DetailedRequestView
          request={selectedRequest}
          worker={selectedWorker}
          onClose={closeRequestDetails}
          onStatusChange={handleDetailStatusChange}
          onDownloadAttachment={handleDownloadAttachment}
        />
      )}
    </MainLayout>
  );
}
