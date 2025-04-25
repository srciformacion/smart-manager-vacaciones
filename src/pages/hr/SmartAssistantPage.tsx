
import { MainLayout } from "@/components/layout/main-layout";
import { SmartAssistantPanel } from "@/components/hr/smart-assistant-panel";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useSmartAssistant } from "@/hooks/hr/use-smart-assistant";

export default function SmartAssistantPage() {
  const {
    user,
    isLoading,
    requests,
    workers,
    balances,
    handleRefresh
  } = useSmartAssistant();

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

        <SmartAssistantPanel
          overlaps={[]}
          groupCrowding={[]}
          permissionAccumulation={[]}
          vacationLimit={[]}
        />
      </div>
    </MainLayout>
  );
}
