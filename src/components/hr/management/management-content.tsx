
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportsGenerator } from "@/components/hr/reports/reports-generator";
import { StaffAvailabilityCalendar } from "@/components/hr/calendar/staff-availability-calendar";
import { RequestsTabContent } from "@/components/hr/requests-tab-content";
import { Request, User } from "@/types";

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
