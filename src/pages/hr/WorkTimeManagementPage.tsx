
import { MainLayout } from "@/components/layout/main-layout";
import { useAuth } from "@/hooks/auth";
import { HRWorkTimeDashboard } from "@/components/work-time/hr-work-time-dashboard";
import { WorkTimeSettings } from "@/components/work-time/work-time-settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkTimeConfig } from "@/hooks/work-time/use-work-time-config";

export default function WorkTimeManagementPage() {
  const { user } = useAuth();
  const { config, loading } = useWorkTimeConfig();

  if (loading) {
    return (
      <MainLayout user={user}>
        <div className="text-center py-8">Cargando configuración...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Jornada Laboral</h1>
          <p className="text-muted-foreground">
            Configura y supervisa el registro de jornadas de los trabajadores
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            {config?.is_enabled ? (
              <HRWorkTimeDashboard />
            ) : (
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold mb-4">Módulo desactivado</h2>
                <p className="text-muted-foreground">
                  Activa el módulo desde la pestaña de configuración para ver el dashboard.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings">
            <WorkTimeSettings />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
