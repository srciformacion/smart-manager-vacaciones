
import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { SmartAssistantPanel } from "@/components/hr/smart-assistant-panel";
import { User, Request, Balance, WorkGroup } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SmartAssistant from "@/utils/smartAssistant";
import NocoDBAPI from "@/utils/nocodbApi";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BarChart, FileSearch, AlertTriangle, PieChart, RefreshCcw } from "lucide-react";

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
  // Solicitudes adicionales para el asistente inteligente
  {
    id: "req-7",
    userId: "1",
    type: "vacation",
    startDate: new Date("2023-08-15"),
    endDate: new Date("2023-08-30"),
    status: "pending",
    createdAt: new Date("2023-07-01"),
    updatedAt: new Date("2023-07-01"),
  },
  {
    id: "req-8",
    userId: "2",
    type: "vacation",
    startDate: new Date("2023-08-15"),
    endDate: new Date("2023-08-25"),
    status: "pending",
    createdAt: new Date("2023-07-05"),
    updatedAt: new Date("2023-07-05"),
  },
  {
    id: "req-9",
    userId: "3",
    type: "personalDay",
    startDate: new Date("2023-09-15"),
    endDate: new Date("2023-09-15"),
    status: "pending",
    createdAt: new Date("2023-09-01"),
    updatedAt: new Date("2023-09-01"),
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
    vacationDays: 5, // Pocos días para generar alerta
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

export default function SmartAssistantPage() {
  const [user, setUser] = useState<User | null>(exampleUser);
  const [workers, setWorkers] = useState<User[]>(exampleWorkers);
  const [requests, setRequests] = useState<Request[]>(exampleRequests);
  const [balances, setBalances] = useState<Record<string, Balance>>(exampleBalances);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  
  // Análisis inteligente
  const smartAnalysis = SmartAssistant.analyzeAll(
    requests,
    workers,
    Object.values(balances)
  );

  // Simular actualización de datos
  const handleRefresh = async () => {
    setIsLoading(true);
    
    try {
      // En una implementación real, obtendríamos datos actualizados
      // const workersData = await NocoDBAPI.getAllUsers();
      // const requestsData = await NocoDBAPI.getAllRequests();
      // const balancesData = await Promise.all(
      //   workersData.map(worker => NocoDBAPI.getUserBalance(worker.id))
      // );
      //
      // setWorkers(workersData);
      // setRequests(requestsData);
      // setBalances(
      //   balancesData.reduce((acc, balance) => {
      //     acc[balance.userId] = balance;
      //     return acc;
      //   }, {})
      // );
      
      // Simular una petición
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mostrar algún tipo de notificación
      alert("Datos actualizados correctamente");
      
    } catch (error) {
      console.error("Error al actualizar datos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout user={user}>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Asistente inteligente</h1>
            <p className="text-muted-foreground mt-2">
              Análisis y recomendaciones para la gestión eficiente del personal
            </p>
          </div>
          
          <Button onClick={handleRefresh} disabled={isLoading}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            {isLoading ? "Actualizando..." : "Actualizar datos"}
          </Button>
        </div>

        {/* Panel de alertas inteligentes */}
        <SmartAssistantPanel
          overlaps={smartAnalysis.overlaps}
          groupCrowding={smartAnalysis.groupCrowding}
          permissionAccumulation={smartAnalysis.permissionAccumulation}
          vacationLimit={smartAnalysis.vacationLimit}
        />

        {/* Paneles de información adicional */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <BarChart className="h-5 w-5 text-primary" />
                Distribución de solicitudes
              </CardTitle>
              <CardDescription>
                Análisis de distribución por tipo y estado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[260px] flex items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-lg">
                <div className="text-muted-foreground text-sm">
                  Gráfico de distribución de solicitudes
                  <p className="text-xs mt-1">(Implementación real: gráfico de barras)</p>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div className="p-2 rounded-md bg-vacay/10">
                  <div className="text-lg font-medium">
                    {requests.filter(r => r.type === "vacation").length}
                  </div>
                  <div className="text-xs text-muted-foreground">Vacaciones</div>
                </div>
                <div className="p-2 rounded-md bg-info/10">
                  <div className="text-lg font-medium">
                    {requests.filter(r => r.type === "personalDay").length}
                  </div>
                  <div className="text-xs text-muted-foreground">Asuntos propios</div>
                </div>
                <div className="p-2 rounded-md bg-secondary/10">
                  <div className="text-lg font-medium">
                    {requests.filter(r => r.type === "leave").length}
                  </div>
                  <div className="text-xs text-muted-foreground">Permisos</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Distribución por departamentos
              </CardTitle>
              <CardDescription>
                Análisis de la carga de solicitudes por departamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[260px] flex items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-lg">
                <div className="text-muted-foreground text-sm">
                  Gráfico de distribución por departamentos
                  <p className="text-xs mt-1">(Implementación real: gráfico circular)</p>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/rrhh/trabajadores")}
                >
                  <FileSearch className="mr-2 h-4 w-4" />
                  Ver todos los trabajadores
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/rrhh/solicitudes")}
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Gestionar solicitudes pendientes ({requests.filter(r => r.status === "pending").length})
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
