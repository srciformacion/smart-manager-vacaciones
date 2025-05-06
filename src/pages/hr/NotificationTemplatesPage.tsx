
import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNotificationTemplates } from "@/hooks/hr/notifications/use-notification-templates";
import { TemplateForm } from "@/components/hr/notifications/TemplateForm";
import { TemplatesList } from "@/components/hr/notifications/TemplatesList";
import { User } from "@/types";

export default function NotificationTemplatesPage() {
  const [user, setUser] = useState<User | null>(() => {
    const userJson = localStorage.getItem("user");
    return userJson ? JSON.parse(userJson) : null;
  });
  
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  
  const {
    templates,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    resetToDefaults
  } = useNotificationTemplates();

  const handleBackToList = () => {
    setSelectedTemplateId(null);
  };

  return (
    <MainLayout user={user}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Plantillas de Notificaciones</h1>
            <p className="text-muted-foreground mt-2">
              Gestiona las plantillas para el envío de notificaciones a trabajadores
            </p>
          </div>
        </div>
        
        <Card className="w-full">
          <CardHeader className={selectedTemplateId ? "" : "hidden"}>
            <CardTitle>
              {selectedTemplateId && selectedTemplateId !== 'new' 
                ? 'Editar plantilla' 
                : 'Nueva plantilla'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {selectedTemplateId ? (
              <TemplateForm
                template={
                  selectedTemplateId === 'new' 
                    ? undefined 
                    : templates.find(t => t.id === selectedTemplateId)
                }
                onSave={(template) => {
                  if (selectedTemplateId === 'new') {
                    addTemplate(template);
                  } else {
                    updateTemplate(selectedTemplateId, template);
                  }
                  handleBackToList();
                }}
                onCancel={handleBackToList}
                onDelete={selectedTemplateId !== 'new' 
                  ? () => {
                      deleteTemplate(selectedTemplateId);
                      handleBackToList();
                    }
                  : undefined
                }
              />
            ) : (
              <TemplatesList
                templates={templates}
                onSelectTemplate={setSelectedTemplateId}
                onAddNew={() => setSelectedTemplateId('new')}
                onResetDefaults={resetToDefaults}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
