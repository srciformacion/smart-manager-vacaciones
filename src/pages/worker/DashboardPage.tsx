
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { WorkerStats } from "@/components/dashboard/worker-stats";
import { RequestList } from "@/components/requests/request-list";
import { RequestDetails } from "@/components/requests/request-details";
import { User, Request, Balance, UserRole } from "@/types";
import NocoDBAPI from "@/utils/nocodbApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

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

const exampleBalance: Balance = {
  id: "balance-1",
  userId: "1",
  vacationDays: 22,
  personalDays: 6,
  leaveDays: 3,
  year: 2023,
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
];

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(exampleUser);
  const [balance, setBalance] = useState<Balance>(exampleBalance);
  const [requests, setRequests] = useState<Request[]>(exampleRequests);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  useEffect(() => {
    // En una implementación real, cargaríamos los datos desde NocoDB
    // const fetchData = async () => {
    //   try {
    //     const userId = localStorage.getItem("userId");
    //     if (!userId) return;
    //
    //     const userData = await NocoDBAPI.getUser(userId);
    //     const balanceData = await NocoDBAPI.getUserBalance(userId);
    //     const requestsData = await NocoDBAPI.getUserRequests(userId);
    //
    //     setUser(userData);
    //     setBalance(balanceData[0]);
    //     setRequests(requestsData);
    //   } catch (error) {
    //     console.error("Error al cargar datos:", error);
    //   }
    // };
    //
    // fetchData();
  }, []);

  // Número de solicitudes pendientes y aprobadas para estadísticas
  const pendingRequests = requests.filter(
    (req) => req.status === "pending"
  ).length;
  const approvedRequests = requests.filter(
    (req) => req.status === "approved"
  ).length;

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

  // Número de días de vacaciones disponibles
  const getVacationBalance = () => {
    // Obtener días aprobados o pendientes
    const usedDays = requests
      .filter(
        (req) =>
          req.type === "vacation" &&
          (req.status === "approved" || req.status === "pending") &&
          new Date(req.startDate).getFullYear() === new Date().getFullYear()
      )
      .reduce((total, req) => {
        const start = new Date(req.startDate);
        const end = new Date(req.endDate);
        const days =
          Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return total + days;
      }, 0);

    return balance.vacationDays - usedDays;
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
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Panel de usuario</h1>
            <p className="text-muted-foreground mt-2">
              Bienvenido/a, {user?.name}. Consulta tu información de vacaciones y solicitudes.
            </p>
          </div>

          {/* Estadísticas de usuario */}
          {user && (
            <WorkerStats
              userRole={user.role as UserRole}
              balance={balance}
              pendingRequests={pendingRequests}
              approvedRequests={approvedRequests}
            />
          )}

          {/* Próximas vacaciones */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium">
                <Calendar className="mr-2 h-4 w-4 inline-block" />
                Próximas vacaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              {requests.filter(
                (req) =>
                  req.type === "vacation" &&
                  req.status === "approved" &&
                  new Date(req.startDate) >= new Date()
              ).length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {requests
                    .filter(
                      (req) =>
                        req.type === "vacation" &&
                        req.status === "approved" &&
                        new Date(req.startDate) >= new Date()
                    )
                    .sort(
                      (a, b) =>
                        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
                    )
                    .slice(0, 3)
                    .map((req) => (
                      <div
                        key={req.id}
                        className="rounded-lg border p-3 cursor-pointer hover:bg-accent"
                        onClick={() => handleViewRequestDetails(req)}
                      >
                        <div className="font-medium">
                          {new Date(req.startDate).toLocaleDateString()} -{" "}
                          {new Date(req.endDate).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {Math.floor(
                            (new Date(req.endDate).getTime() -
                              new Date(req.startDate).getTime()) /
                              (1000 * 60 * 60 * 24)
                          ) + 1}{" "}
                          días
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-muted-foreground py-4 text-center">
                  No tienes vacaciones aprobadas próximamente
                </div>
              )}
            </CardContent>
          </Card>

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
