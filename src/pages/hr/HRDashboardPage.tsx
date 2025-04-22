
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { HRStats } from "@/components/dashboard/hr-stats";
import { SmartAssistantPanel } from "@/components/hr/smart-assistant-panel";
import { User, Request, Balance, WorkGroup } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RequestList } from "@/components/requests/request-list";
import { RequestDetails } from "@/components/requests/request-details";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import SmartAssistant from "@/utils/smartAssistant";
import NocoDBAPI from "@/utils/nocodbApi";

// Datos de ejemplo para demostración
const exampleUser: User = {
  id: "admin",
  name: "Carlos Rodríguez",
  email: "carlos.rodriguez@empresa.com",
  role: "hr",
  shift: "Programado",
  workGroup: "Grupo Programado",
  workday: "Completa",
  department: "Recursos Humanos",
  seniority: 5,
};

const exampleWorkers: User[] = [
  {
    id: "1",
    name: "Ana Martínez",
    email: "ana.martinez@empresa.com",
    role: "worker",
    shift: "Programado",
    workGroup: "Grupo Programado",
    workday: "Completa",
    department: "Atención al cliente",
    seniority: 3,
  },
  {
    id: "2",
    name: "Luis García",
    email: "luis.garcia@empresa.com",
    role: "worker",
    shift: "Urgente 24h",
    workGroup: "Urgente 24h",
    workday: "Completa",
    department: "Operaciones",
    seniority: 2,
  },
  {
    id: "3",
    name: "Elena Sánchez",
    email: "elena.sanchez@empresa.com",
    role: "worker",
    shift: "Localizado",
    workGroup: "Grupo Localizado",
    workday: "Completa",
    department: "Administración",
    seniority: 5,
  },
];

const exampleRequests: Request[] = [
  {
    id: "req-1",
    userId: "1",
    type: "vacation",
    startDate: new Date("2023-08-01"),
    endDate: new Date("2023-08-07"),
    status: "approved",
    createdAt: new Date("2023-06-15"),
    updatedAt: new Date("2023-06-16"),
  },
  {
    id: "req-2",
    userId: "1",
    type: "personalDay",
    startDate: new Date("2023-09-15"),
    endDate: new Date("2023-09-15"),
    reason: "Asuntos familiares",
    status: "pending",
    createdAt: new Date("2023-09-01"),
    updatedAt: new Date("2023-09-01"),
  },
  {
    id: "req-3",
    userId: "2",
    type: "leave",
    startDate: new Date("2023-10-10"),
    endDate: new Date("2023-10-11"),
    reason: "Cita médica",
    status: "pending",
    attachmentUrl: "/placeholder.svg",
    createdAt: new Date("2023-10-01"),
    updatedAt: new Date("2023-10-01"),
  },
  {
    id: "req-4",
    userId: "3",
    type: "vacation",
    startDate: new Date("2023-12-20"),
    endDate: new Date("2023-12-31"),
    status: "pending",
    createdAt: new Date("2023-11-01"),
    updatedAt: new Date("2023-11-01"),
  },
];

const exampleBalances: Record<string, Balance> = {
  "1": {
    id: "balance-1",
    userId: "1",
    vacationDays: 22,
    personalDays: 6,
    leaveDays: 3,
    year: 2023,
  },
  "2": {
    id: "balance-2",
    userId: "2",
    vacationDays: 15,
    personalDays: 4,
    leaveDays: 3,
    year: 2023,
  },
  "3": {
    id: "balance-3",
    userId: "3",
    vacationDays: 25,
    personalDays: 6,
    leaveDays: 3,
    year: 2023,
  },
};

export default function HRDashboardPage() {
  const [user, setUser] = useState<User | null>(exampleUser);
  const [workers, setWorkers] = useState<User[]>(exampleWorkers);
  const [requests, setRequests] = useState<Request[]>(exampleRequests);
  const [balances, setBalances] = useState<Record<string, Balance>>(exampleBalances);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<User | null>(null);
  
  const navigate = useNavigate();

  // Análisis inteligente
  const smartAnalysis = SmartAssistant.analyzeAll(
    requests,
    workers,
    Object.values(balances)
  );

  // Estadísticas para el panel
  const totalWorkers = workers.length;
  const pendingRequests = requests.filter((req) => req.status === "pending").length;
  const approvedRequests = requests.filter((req) => req.status === "approved").length;
  const alertsCount = 
    smartAnalysis.overlaps.length + 
    smartAnalysis.groupCrowding.length + 
    smartAnalysis.permissionAccumulation.length + 
    smartAnalysis.vacationLimit.length;
    
  // Solicitudes de esta semana (último 7 días)
  const now = new Date();
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weeklyRequests = requests.filter(
    (req) => new Date(req.createdAt) >= oneWeekAgo
  ).length;

  // Manejar cambio de estado de solicitud
  const handleStatusChange = async (request: Request, newStatus: Request["status"]) => {
    try {
      // En una implementación real, actualizaríamos en NocoDB
      // await NocoDBAPI.updateRequestStatus(request.id, newStatus);
      
      // Actualizar estado local
      const updatedRequests = requests.map(req => 
        req.id === request.id 
          ? { ...req, status: newStatus, updatedAt: new Date() } 
          : req
      );
      
      setRequests(updatedRequests);
      setSelectedRequest(null);
      
      // Mostrar algún tipo de notificación
      alert(`Solicitud ${request.id} actualizada a estado: ${newStatus}`);
      
    } catch (error) {
      console.error("Error al actualizar solicitud:", error);
    }
  };

  // Manejar la vista de detalles de solicitud
  const handleViewRequestDetails = (request: Request) => {
    // Encontrar el trabajador asociado a esta solicitud
    const worker = workers.find(w => w.id === request.userId) || null;
    setSelectedWorker(worker);
    setSelectedRequest(request);
  };

  // Manejar descarga de adjunto
  const handleDownloadAttachment = () => {
    if (selectedRequest?.attachmentUrl) {
      // En una implementación real, descargaríamos el archivo
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
          onStatusChange={(status) => handleStatusChange(selectedRequest, status)}
          onDownloadAttachment={handleDownloadAttachment}
          isHRView={true}
        />
      ) : (
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Panel de RRHH</h1>
            <p className="text-muted-foreground mt-2">
              Gestione solicitudes, trabadores y obtenga recomendaciones inteligentes
            </p>
          </div>

          {/* Estadísticas de RRHH */}
          <HRStats
            totalWorkers={totalWorkers}
            pendingRequests={pendingRequests}
            approvedRequests={approvedRequests}
            alertsCount={alertsCount}
            weeklyRequests={weeklyRequests}
          />

          {/* Panel inteligente */}
          <SmartAssistantPanel
            overlaps={smartAnalysis.overlaps}
            groupCrowding={smartAnalysis.groupCrowding}
            permissionAccumulation={smartAnalysis.permissionAccumulation}
            vacationLimit={smartAnalysis.vacationLimit}
          />

          {/* Solicitudes pendientes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium">
                Solicitudes pendientes
              </CardTitle>
              <Button onClick={() => navigate("/rrhh/solicitudes")}>
                Ver todas
              </Button>
            </CardHeader>
            <CardContent>
              <RequestList
                requests={requests.filter(req => req.status === "pending")}
                users={workers}
                isHRView={true}
                onViewDetails={handleViewRequestDetails}
                onStatusChange={handleStatusChange}
                onDownloadAttachment={handleViewRequestDetails}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </MainLayout>
  );
}
