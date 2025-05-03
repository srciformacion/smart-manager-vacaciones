
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { exampleRequests } from "@/data/example-requests";
import { exampleUser } from "@/data/example-users";
import { RequestStatus, Request, User } from "@/types";
import { useRequestManagement } from "@/hooks/hr/use-request-management";
import { DetailedRequestView } from "@/components/hr/detailed-request-view";
import { Tabs, TabsContent as RadixTabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RealtimeRequests } from "@/components/hr/requests-management/realtime-requests";
import { enableRealtimeForTable } from "@/utils/realtime-utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Componente para el encabezado de la página
function Header({ viewMode, setViewMode }: { viewMode: "list" | "calendar", setViewMode: (mode: "list" | "calendar") => void }) {
  return (
    <div className="flex items-center justify-between p-6 border-b">
      <div>
        <h1 className="text-2xl font-bold">Gestión de Solicitudes</h1>
        <p className="text-muted-foreground">Gestione las solicitudes de los trabajadores</p>
      </div>
      <div className="flex items-center space-x-2">
        {/* Controles de visualización */}
      </div>
    </div>
  );
}

// Componente para el contenido de las pestañas
function TabsContent({ 
  requests, 
  workers, 
  onViewDetails, 
  onStatusChange, 
  onDownloadAttachment 
}: { 
  requests: Request[], 
  workers: User[], 
  onViewDetails: (req: Request) => void, 
  onStatusChange: (req: Request, status: RequestStatus) => void, 
  onDownloadAttachment: (req: Request) => void 
}) {
  return (
    <div className="space-y-4">
      {/* Aquí estaría el contenido principal de las solicitudes */}
      <p>Total de solicitudes: {requests.length}</p>
    </div>
  );
}

export default function RequestsManagementPage() {
  const [activeTab, setActiveTab] = useState("realtime"); // Cambiado a "realtime" por defecto
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [realtimeEnabled, setRealtimeEnabled] = useState(false);

  // En lugar de usar exampleUsers importado, lo definimos aquí para evitar el error de importación
  const workers: User[] = exampleUser ? [exampleUser] : [];

  const {
    selectedRequest,
    selectedWorker,
    handleViewRequestDetails,
    handleDetailStatusChange,
    handleDownloadAttachment,
    closeRequestDetails,
  } = useRequestManagement(exampleRequests, workers);

  // En un entorno de producción, estas serían solicitudes reales de la base de datos
  const requests: Request[] = exampleRequests;

  // Efecto para habilitar el tiempo real al cargar la página
  useEffect(() => {
    const setupRealtime = async () => {
      try {
        const result = await enableRealtimeForTable('requests');
        if (result.success) {
          setRealtimeEnabled(true);
          console.log("Tiempo real habilitado para la tabla 'requests'");
        } else {
          console.error("Error al habilitar tiempo real:", result.error);
        }
      } catch (err) {
        console.error("Error al configurar tiempo real:", err);
      }
    };

    setupRealtime();
  }, []);

  return (
    <MainLayout user={exampleUser}>
      <Header 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
      />

      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Solicitudes</CardTitle>
            {realtimeEnabled && (
              <div className="text-sm text-green-500 flex items-center gap-1">
                <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                Tiempo real habilitado
              </div>
            )}
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

      {selectedRequest && (
        <DetailedRequestView
          request={selectedRequest}
          onClose={closeRequestDetails}
          onStatusChange={handleDetailStatusChange}
          onDownloadAttachment={handleDownloadAttachment}
        />
      )}
    </MainLayout>
  );
}
