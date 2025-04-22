
import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { RequestList } from "@/components/requests/request-list";
import { RequestDetails } from "@/components/requests/request-details";
import { User, Request, RequestStatus } from "@/types";
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
  {
    id: "req-5",
    userId: "2",
    type: "leave",
    startDate: new Date("2023-07-05"),
    endDate: new Date("2023-07-06"),
    reason: "Trámites administrativos",
    status: "rejected",
    observations: "Falta documentación justificativa",
    createdAt: new Date("2023-06-25"),
    updatedAt: new Date("2023-06-26"),
  },
  {
    id: "req-6",
    userId: "3",
    type: "personalDay",
    startDate: new Date("2023-11-02"),
    endDate: new Date("2023-11-02"),
    status: "approved",
    createdAt: new Date("2023-10-20"),
    updatedAt: new Date("2023-10-21"),
  },
];

export default function RequestsManagementPage() {
  const [user, setUser] = useState<User | null>(exampleUser);
  const [workers, setWorkers] = useState<User[]>(exampleWorkers);
  const [requests, setRequests] = useState<Request[]>(exampleRequests);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<User | null>(null);

  // Manejar cambio de estado de solicitud
  const handleStatusChange = async (request: Request, newStatus: RequestStatus) => {
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

  // Manejar cambio de estado desde la vista de detalles
  const handleDetailStatusChange = (status: RequestStatus) => {
    if (selectedRequest) {
      handleStatusChange(selectedRequest, status);
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

          <RequestList
            requests={requests}
            users={workers}
            isHRView={true}
            onViewDetails={handleViewRequestDetails}
            onStatusChange={handleStatusChange}
            onDownloadAttachment={handleViewRequestDetails}
          />
        </div>
      )}
    </MainLayout>
  );
}
