
import { MainLayout } from "@/components/layout/main-layout";
import { SmartAssistantPanel } from "@/components/hr/smart-assistant-panel";
import { Button } from "@/components/ui/button";
import { RefreshCcw, FileDown, FileText, Table } from "lucide-react";
import { useSmartAssistant } from "@/hooks/hr/use-smart-assistant";
import { exampleRequests } from "@/data/example-requests";
import { exampleWorkers } from "@/data/example-users";
import { exampleBalances } from "@/data/example-balances";
import { SmartAssistant } from "@/utils/hr/smart-assistant";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function SmartAssistantPage() {
  const {
    user,
    isLoading,
    requests,
    workers,
    balances,
    handleRefresh,
    exportData,
    initializeWithExamples
  } = useSmartAssistant();
  
  // Inicializar con datos de ejemplo al cargar el componente
  useState(() => {
    initializeWithExamples(exampleRequests, exampleWorkers, exampleBalances);
  });
  
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  // Asegúrese de tener datos de análisis
  const smartAnalysis = SmartAssistant.analyze(
    exampleRequests, 
    exampleWorkers, 
    Object.values(exampleBalances)
  );

  const tutorialSteps = [
    {
      title: "Bienvenido a La Rioja Cuida",
      description: "Esta herramienta te ayuda a gestionar mejor tu equipo identificando situaciones que requieren atención."
    },
    {
      title: "Panel de Alertas",
      description: "Aquí puedes ver alertas sobre solapamientos, exceso de personal, acumulación de permisos y límites de vacaciones."
    },
    {
      title: "Exportación de Datos",
      description: "Puedes exportar los análisis en diferentes formatos haciendo clic en el botón 'Exportar'."
    },
    {
      title: "Actualización de Datos",
      description: "Utiliza el botón 'Actualizar datos' para refrescar la información y obtener las alertas más recientes."
    }
  ];

  const handleNextStep = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(tutorialStep + 1);
    } else {
      setShowTutorial(false);
      // Almacenar en localStorage que el tutorial ha sido visto
      localStorage.setItem('smartAssistantTutorialSeen', 'true');
      toast({
        title: "Tutorial completado",
        description: "Ahora puedes utilizar todas las funciones de La Rioja Cuida"
      });
    }
  };

  // Mostrar tutorial automáticamente si no se ha visto antes
  useState(() => {
    const tutorialSeen = localStorage.getItem('smartAssistantTutorialSeen');
    if (!tutorialSeen) {
      setShowTutorial(true);
    }
  });

  return (
    <MainLayout user={user}>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">La Rioja Cuida</h1>
            <p className="text-muted-foreground mt-2">
              Análisis y recomendaciones para la gestión eficiente del personal
            </p>
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <FileDown className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => exportData('pdf')}>
                  <FileText className="mr-2 h-4 w-4" />
                  Exportar como PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportData('excel')}>
                  <Table className="mr-2 h-4 w-4" />
                  Exportar como Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button onClick={() => setShowTutorial(true)} variant="outline">
              <AlertCircle className="mr-2 h-4 w-4" />
              Tutorial
            </Button>
            
            <Button onClick={handleRefresh} disabled={isLoading}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              {isLoading ? "Actualizando..." : "Actualizar datos"}
            </Button>
          </div>
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

        {/* Tutorial Dialog */}
        <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{tutorialSteps[tutorialStep].title}</DialogTitle>
              <DialogDescription>
                {tutorialSteps[tutorialStep].description}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <div className="flex w-full justify-between items-center mt-4">
                <div className="flex space-x-1">
                  {tutorialSteps.map((_, index) => (
                    <div 
                      key={index} 
                      className={`h-2 w-2 rounded-full ${index === tutorialStep ? 'bg-primary' : 'bg-muted'}`}
                    />
                  ))}
                </div>
                <Button onClick={handleNextStep}>
                  {tutorialStep === tutorialSteps.length - 1 ? 'Finalizar' : 'Siguiente'}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
