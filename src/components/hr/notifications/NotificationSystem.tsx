
import { useState } from "react";
import { useNotificationTemplates } from "@/hooks/hr/notifications/use-notification-templates";
import { useNotificationThreads } from "@/hooks/hr/notifications/use-notification-threads";
import { User } from "@/types";
import { TemplatesList } from "./TemplatesList";
import { TemplateForm } from "./TemplateForm";
import { ThreadsList } from "./ThreadsList";
import { ThreadDetail } from "./ThreadDetail";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { exampleUser } from "@/data/example-users";

interface NotificationSystemProps {
  initialTab?: string;
  user?: User;
}

export function NotificationSystem({ initialTab = "threads", user = exampleUser }: NotificationSystemProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  
  const {
    templates,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    processTemplate,
    resetToDefaults
  } = useNotificationTemplates();
  
  const {
    threads,
    loading: threadsLoading,
    createThread,
    addMessage,
    markThreadAsRead,
    closeThread,
    getUnreadCounts
  } = useNotificationThreads(user);
  
  const { unreadThreads } = getUnreadCounts();

  const handleSelectThread = (threadId: string) => {
    setSelectedThreadId(threadId);
    markThreadAsRead(threadId);
  };

  const handleBackToList = () => {
    setSelectedThreadId(null);
    setSelectedTemplateId(null);
  };

  return (
    <Card className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="threads" className="relative">
            Conversaciones
            {unreadThreads > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                {unreadThreads}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="templates">Plantillas</TabsTrigger>
          <TabsTrigger value="scheduled">Programadas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="threads" className="mt-4">
          {selectedThreadId ? (
            <ThreadDetail
              threadId={selectedThreadId}
              threads={threads}
              onBack={handleBackToList}
              onSendMessage={addMessage}
              onCloseThread={closeThread}
              currentUserId={user.id}
            />
          ) : (
            <ThreadsList
              threads={threads}
              loading={threadsLoading}
              onSelectThread={handleSelectThread}
              currentUserId={user.id}
            />
          )}
        </TabsContent>
        
        <TabsContent value="templates" className="mt-4">
          {selectedTemplateId ? (
            <TemplateForm
              template={templates.find(t => t.id === selectedTemplateId)}
              onSave={(template) => {
                updateTemplate(selectedTemplateId, template);
                handleBackToList();
              }}
              onCancel={handleBackToList}
              onDelete={() => {
                deleteTemplate(selectedTemplateId);
                handleBackToList();
              }}
            />
          ) : (
            <TemplatesList
              templates={templates}
              onSelectTemplate={setSelectedTemplateId}
              onAddNew={() => setSelectedTemplateId('new')}
              onResetDefaults={resetToDefaults}
            />
          )}
        </TabsContent>
        
        <TabsContent value="scheduled" className="mt-4">
          <ScheduledNotifications 
            templates={templates}
            processTemplate={processTemplate}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
}

// Simple placeholder for the scheduled notifications component that will be implemented separately
function ScheduledNotifications({ templates, processTemplate }: any) {
  return (
    <div className="p-4 text-center text-muted-foreground">
      <p>Próximamente: Programación de notificaciones automáticas</p>
    </div>
  );
}
