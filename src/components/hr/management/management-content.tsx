
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { StaffAvailabilityCalendar } from "@/components/hr/calendar/staff-availability-calendar";
import { RequestsTabContent } from "@/components/hr/requests-tab-content";
import { ReportsGenerator } from "@/components/hr/reports/reports-generator";
import { NotificationSender } from "@/components/hr/notification-sender";
import { SearchInput } from "@/components/hr/search-input";
import { RequestStatus, Request, User, Department } from "@/types";

interface ManagementContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  requests: Request[];
  workers: User[];
  onViewDetails: (request: Request) => void;
  onStatusChange: (request: Request, newStatus: RequestStatus) => void;
  onDownloadAttachment: (request: Request) => void;
}

export function ManagementContent({
  activeTab,
  setActiveTab,
  requests,
  workers,
  onViewDetails,
  onStatusChange,
  onDownloadAttachment,
}: ManagementContentProps) {
  // Estado para búsqueda y filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">("all");
  const [departmentFilter, setDepartmentFilter] = useState<Department | "all">("all");

  // Obtener departamentos únicos
  const departments = workers.reduce<Department[]>((acc, worker) => {
    if (!acc.includes(worker.department)) {
      acc.push(worker.department);
    }
    return acc;
  }, []);

  // Filtrar solicitudes
  const filteredRequests = requests.filter((request) => {
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const worker = workers.find((w) => w.id === request.userId);
    const matchesDepartment = departmentFilter === "all" || (worker && worker.department === departmentFilter);
    return matchesStatus && matchesDepartment;
  });

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid grid-cols-4 md:w-[600px]">
        <TabsTrigger value="solicitudes">Solicitudes</TabsTrigger>
        <TabsTrigger value="calendario">Calendario</TabsTrigger>
        <TabsTrigger value="informes">Informes</TabsTrigger>
        <TabsTrigger value="notificaciones">Notificaciones</TabsTrigger>
      </TabsList>
      
      <TabsContent value="solicitudes">
        <Card>
          <CardContent className="pt-6">
            <div className="mb-4">
              <SearchInput 
                placeholder="Buscar solicitudes..." 
                value={searchQuery}
                onChange={(value) => setSearchQuery(value)}
              />
            </div>
            
            <RequestsTabContent 
              requests={filteredRequests}
              users={workers}
              onViewDetails={onViewDetails}
              onStatusChange={onStatusChange}
              onDownloadAttachment={onDownloadAttachment}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              departmentFilter={departmentFilter}
              setDepartmentFilter={setDepartmentFilter}
              departments={departments}
            />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="calendario">
        <Card>
          <CardContent className="pt-6">
            <StaffAvailabilityCalendar />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="informes">
        <Card>
          <CardContent className="pt-6">
            <ReportsGenerator />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="notificaciones">
        <Card>
          <CardContent className="pt-6">
            <NotificationSender />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
