
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RequestsTabContent } from "@/components/hr/requests-tab-content";
import { Request, User, RequestStatus, Department } from "@/types";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ManagementContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  requests: Request[];
  workers: User[];
  onViewDetails: (request: Request) => void;
  onStatusChange: (request: Request, newStatus: RequestStatus) => void;
  onDownloadAttachment: (request: Request) => void;
  showWorkerInfo?: boolean;
}

export function ManagementContent({
  activeTab,
  setActiveTab,
  requests,
  workers,
  onViewDetails,
  onStatusChange,
  onDownloadAttachment,
  showWorkerInfo = false
}: ManagementContentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">("all");
  const [departmentFilter, setDepartmentFilter] = useState<Department | "all">("all");

  // Filtrar solicitudes por término de búsqueda (nombre del trabajador)
  const filteredRequests = requests.filter(request => {
    const worker = workers.find(w => w.id === request.userId);
    const workerName = worker ? worker.name.toLowerCase() : "";
    
    const matchesSearch = searchTerm === "" || 
      workerName.includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    
    const matchesDepartment = departmentFilter === "all" || 
      (worker && worker.department === departmentFilter);
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  return (
    <div className="space-y-6">
      {/* Barra de búsqueda mejorada */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por trabajador, ID de solicitud o tipo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="solicitudes">Todas las solicitudes</TabsTrigger>
          <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
          <TabsTrigger value="aprobadas">Aprobadas</TabsTrigger>
          <TabsTrigger value="rechazadas">Rechazadas</TabsTrigger>
        </TabsList>

        <TabsContent value="solicitudes">
          <RequestsTabContent
            requests={filteredRequests}
            workers={workers}
            onViewDetails={onViewDetails}
            onStatusChange={onStatusChange}
            onDownloadAttachment={onDownloadAttachment}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            departmentFilter={departmentFilter}
            setDepartmentFilter={setDepartmentFilter}
            showWorkerInfo={showWorkerInfo}
          />
        </TabsContent>

        <TabsContent value="pendientes">
          <RequestsTabContent
            requests={filteredRequests.filter(r => r.status === "pending")}
            workers={workers}
            onViewDetails={onViewDetails}
            onStatusChange={onStatusChange}
            onDownloadAttachment={onDownloadAttachment}
            statusFilter="pending"
            setStatusFilter={setStatusFilter}
            departmentFilter={departmentFilter}
            setDepartmentFilter={setDepartmentFilter}
            showWorkerInfo={showWorkerInfo}
          />
        </TabsContent>

        <TabsContent value="aprobadas">
          <RequestsTabContent
            requests={filteredRequests.filter(r => r.status === "approved")}
            workers={workers}
            onViewDetails={onViewDetails}
            onStatusChange={onStatusChange}
            onDownloadAttachment={onDownloadAttachment}
            statusFilter="approved"
            setStatusFilter={setStatusFilter}
            departmentFilter={departmentFilter}
            setDepartmentFilter={setDepartmentFilter}
            showWorkerInfo={showWorkerInfo}
          />
        </TabsContent>

        <TabsContent value="rechazadas">
          <RequestsTabContent
            requests={filteredRequests.filter(r => r.status === "rejected")}
            workers={workers}
            onViewDetails={onViewDetails}
            onStatusChange={onStatusChange}
            onDownloadAttachment={onDownloadAttachment}
            statusFilter="rejected"
            setStatusFilter={setStatusFilter}
            departmentFilter={departmentFilter}
            setDepartmentFilter={setDepartmentFilter}
            showWorkerInfo={showWorkerInfo}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
