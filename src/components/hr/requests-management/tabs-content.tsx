
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationSender } from "@/components/hr/notification-sender";
import { RequestsTabContent } from "@/components/hr/requests-tab-content";
import { Request, User } from "@/types";

interface TabsContentProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  requests: Request[];
  workers: User[];
  onViewDetails: (request: Request) => void;
  onStatusChange: (request: Request, newStatus: string) => void;
  onDownloadAttachment: (request: Request) => void;
}

export function RequestsManagementTabs({
  activeTab,
  setActiveTab,
  requests,
  workers,
  onViewDetails,
  onStatusChange,
  onDownloadAttachment,
}: TabsContentProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="solicitudes">Solicitudes</TabsTrigger>
        <TabsTrigger value="notificaciones">Enviar notificaciones</TabsTrigger>
      </TabsList>
      <TabsContent value="solicitudes">
        <RequestsTabContent
          requests={requests}
          workers={workers}
          onViewDetails={onViewDetails}
          onStatusChange={onStatusChange}
          onDownloadAttachment={onDownloadAttachment}
        />
      </TabsContent>
      <TabsContent value="notificaciones">
        <div className="max-w-2xl mx-auto">
          <NotificationSender />
        </div>
      </TabsContent>
    </Tabs>
  );
}
