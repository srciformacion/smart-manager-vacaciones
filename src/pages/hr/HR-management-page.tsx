import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { DetailedRequestView } from "@/components/hr/detailed-request-view";
import { ReportsGenerator } from "@/components/hr/reports/reports-generator";
import { StaffAvailabilityCalendar } from "@/components/hr/calendar/staff-availability-calendar";
import { User, Request, Department } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RequestsTabContent } from "@/components/hr/requests-tab-content";
import { toast } from "@/components/ui/use-toast";
import { useRequests } from "@/hooks/use-requests";

// Datos de ejemplo
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

// Extraer departamentos únicos
const uniqueDepartments: Department[] = [...new Set(exampleWorkers.map(worker => worker.department))];

export default function HRManagementPage() {
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

  const handleDetailStatusChange = (request: Request, newStatus: Request["status"], observations?: string) => {
    // Actualiza la solicitud con observaciones si se proporcionaron
    const updatedRequest = observations 
      ? { ...request, observations }
      : request;
    
    handleStatusChange(updatedRequest, newStatus);
    
    // Cierra la vista detallada después de procesar
    setTimeout(() => {
      setSelectedRequest(null);
      setSelectedWorker(null);
    }, 1500);
  };

  const handleDownloadAttachment = (request: Request) => {
    if (request.attachmentUrl) {
      console.log("Descargando adjunto:", request.attachmentUrl);
      toast({
        title: "Descargando archivo",
        description: "El justificante se está descargando...",
      });
    }
  };

  return (
    <MainLayout user={user}>
      {selectedRequest ? (
        <DetailedRequestView
          request={selectedRequest}
          user={selectedWorker}
          onClose={() => {
            setSelectedRequest(null);
            setSelectedWorker(null);
          }}
          onStatusChange={handleDetailStatusChange}
          onDownloadAttachment={handleDownloadAttachment}
        />
      ) : (
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Panel de gestión RRHH</h1>
            <p className="text-muted-foreground mt-2">
              Gestione solicitudes, genere informes y visualice la disponibilidad del personal
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full md:w-auto">
              <TabsTrigger value="solicitudes">Solicitudes</TabsTrigger>
              <TabsTrigger value="informes">Informes</TabsTrigger>
              <TabsTrigger value="calendario">Calendario</TabsTrigger>
            </TabsList>
            
            <TabsContent value="solicitudes" className="mt-6">
              <RequestsTabContent
                requests={requests}
                workers={exampleWorkers}
                onViewDetails={handleViewRequestDetails}
                onStatusChange={handleStatusChange}
                onDownloadAttachment={handleDownloadAttachment}
              />
            </TabsContent>
            
            <TabsContent value="informes" className="mt-6">
              <ReportsGenerator 
                requests={requests}
                users={exampleWorkers}
                departments={uniqueDepartments}
              />
            </TabsContent>
            
            <TabsContent value="calendario" className="mt-6">
              <StaffAvailabilityCalendar 
                requests={requests}
                users={exampleWorkers}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </MainLayout>
  );
}
