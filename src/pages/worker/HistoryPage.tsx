
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { RequestList } from "@/components/requests/request-list";
import { RequestDetails } from "@/components/requests/request-details";
import { User, Request } from "@/types";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, FileCheck, Plus } from "lucide-react";

// Datos de ejemplo para demostración
const exampleUser: User = {
  id: "1",
  name: "Ana Martínez",
  email: "ana.martinez@empresa.com",
  role: "worker",
  shift: "Programado",
  workGroup: "Grupo Programado",
  workday: "Completa",
  department: "Atención al cliente",
  seniority: 3,
};

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
    userId: "1",
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
    userId: "1",
    type: "vacation",
    startDate: new Date("2023-12-20"),
    endDate: new Date("2023-12-31"),
    status: "rejected",
    observations: "Periodo con alta carga de trabajo",
    createdAt: new Date("2023-11-01"),
    updatedAt: new Date("2023-11-05"),
  },
];

export default function HistoryPage() {
  const [user, setUser] = useState<User | null>(exampleUser);
  const [requests, setRequests] = useState<Request[]>(exampleRequests);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // En una implementación real, cargaríamos los datos desde NocoDB
    // const fetchData = async () => {
    //   try {
    //     const userId = localStorage.getItem("userId");
    //     if (!userId) return;
    //
    //     const userData = await NocoDBAPI.getUser(userId);
    //     const requestsData = await NocoDBAPI.getUserRequests(userId);
    //
    //     setUser(userData);
    //     setRequests(requestsData);
    //   } catch (error) {
    //     console.error("Error al cargar datos:", error);
    //   }
    // };
    //
    // fetchData();
  }, []);

  // Manejar la vista de detalles de solicitud
  const handleViewRequestDetails = (request: Request) => {
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
          onClose={() => setSelectedRequest(null)}
          onDownloadAttachment={handleDownloadAttachment}
        />
      ) : (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Historial de solicitudes</h1>
              <p className="text-muted-foreground mt-2">
                Consulta el estado de todas tus solicitudes
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={() => navigate("/solicitudes/vacaciones")}>
                <Calendar className="mr-2 h-4 w-4" />
                Vacaciones
              </Button>
              <Button onClick={() => navigate("/solicitudes/asuntos-propios")}>
                <Clock className="mr-2 h-4 w-4" />
                Asuntos propios
              </Button>
              <Button onClick={() => navigate("/solicitudes/permisos")}>
                <FileCheck className="mr-2 h-4 w-4" />
                Permisos
              </Button>
            </div>
          </div>

          {/* Lista de solicitudes */}
          <RequestList
            requests={requests}
            onViewDetails={handleViewRequestDetails}
            onDownloadAttachment={handleViewRequestDetails}
          />
        </div>
      )}
    </MainLayout>
  );
}
