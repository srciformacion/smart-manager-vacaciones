
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportsGenerator } from "@/components/hr/reports/reports-generator";
import { StaffAvailabilityCalendar } from "@/components/hr/calendar/staff-availability-calendar";
import { RequestsTabContent } from "@/components/hr/requests-tab-content";
import { Request, User, Department } from "@/types";

interface ManagementContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  requests: Request[];
  workers: User[];
  onViewDetails: (request: Request) => void;
  onStatusChange: (request: Request, newStatus: Request["status"]) => void;
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
  // Create a departments array from worker departments for the reports
  // Filter out empty strings and cast to Department type to fix the type error
  const departments: Department[] = Array.from(
    new Set(workers.map(worker => worker.department || ""))
  ).filter((dept): dept is Department => dept !== "");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-3 w-full md:w-auto">
        <TabsTrigger value="solicitudes">Solicitudes</TabsTrigger>
        <TabsTrigger value="informes">Informes</TabsTrigger>
        <TabsTrigger value="calendario">Calendario</TabsTrigger>
      </TabsList>
      
      <TabsContent value="solicitudes" className="mt-6">
        <RequestsTabContent
          requests={requests}
          workers={workers}
          onViewDetails={onViewDetails}
          onStatusChange={onStatusChange}
          onDownloadAttachment={onDownloadAttachment}
        />
      </TabsContent>
      
      <TabsContent value="informes" className="mt-6">
        <ReportsGenerator 
          requests={requests}
          users={workers}
          departments={departments}
        />
      </TabsContent>
      
      <TabsContent value="calendario" className="mt-6">
        <StaffAvailabilityCalendar 
          requests={requests}
          users={workers}
        />
      </TabsContent>
    </Tabs>
  );
}
