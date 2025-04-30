
import { MainLayout } from "@/components/layout/main-layout";
import { SmartAssistantPanel } from "@/components/hr/smart-assistant-panel";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useSmartAssistant } from "@/hooks/hr/use-smart-assistant";
import { exampleRequests } from "@/data/example-requests";
import { exampleWorkers } from "@/data/example-users";
import { exampleBalances } from "@/data/example-balances";
import { SmartAssistant } from "@/utils/hr/smart-assistant";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function SmartAssistantPage() {
  const {
    user,
    isLoading,
    requests,
    workers,
    balances,
    handleRefresh
  } = useSmartAssistant();

  // Asegúrese de tener datos de análisis
  const smartAnalysis = SmartAssistant.analyze(
    exampleRequests, 
    exampleWorkers, 
    Object.values(exampleBalances)
  );

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

        {smartAnalysis.overlaps.length === 0 && 
         smartAnalysis.groupCrowding.length === 0 && 
         smartAnalysis.permissionAccumulation.length === 0 && 
         smartAnalysis.vacationLimit.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No hay alertas actualmente</AlertTitle>
            <AlertDescription>
              El sistema no ha detectado ninguna situación que requiera atención en este momento.
            </AlertDescription>
          </Alert>
        ) : (
          <SmartAssistantPanel
            overlaps={smartAnalysis.overlaps}
            groupCrowding={smartAnalysis.groupCrowding}
            permissionAccumulation={smartAnalysis.permissionAccumulation}
            vacationLimit={smartAnalysis.vacationLimit}
          />
        )}
      </div>
    </MainLayout>
  );
}
