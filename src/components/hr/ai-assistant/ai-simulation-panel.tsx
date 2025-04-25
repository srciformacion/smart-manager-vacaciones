
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { AIService, SimulationResult } from "@/utils/ai/AIService";
import { Request, User } from "@/types";
import { Separator } from "@/components/ui/separator";

interface AISimulationPanelProps {
  requests: Request[];
  workers: User[];
  aiService: AIService;
}

export function AISimulationPanel({ requests, workers, aiService }: AISimulationPanelProps) {
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  
  // Filter to show only pending vacation requests
  const pendingRequests = requests.filter(req => 
    req.status === "pending" && 
    req.type === "vacation"
  );
  
  const handleSelectRequest = (requestId: string) => {
    if (selectedRequests.includes(requestId)) {
      setSelectedRequests(selectedRequests.filter(id => id !== requestId));
    } else {
      setSelectedRequests([...selectedRequests, requestId]);
    }
  };
  
  const handleAddAllRequests = () => {
    setSelectedRequests(pendingRequests.map(req => req.id));
  };
  
  const handleClearSelection = () => {
    setSelectedRequests([]);
  };
  
  const handleRunSimulation = () => {
    if (selectedRequests.length === 0) return;
    
    setIsRunning(true);
    
    // Simulate delay
    setTimeout(() => {
      const result = aiService.simulateApproval(selectedRequests);
      setSimulationResult(result);
      setIsRunning(false);
    }, 1500);
  };
  
  const getWorkerName = (userId: string): string => {
    const worker = workers.find(w => w.id === userId);
    return worker ? worker.name : "Desconocido";
  };
  
  const getRequestDates = (request: Request): string => {
    return `${new Date(request.startDate).toLocaleDateString()} - ${new Date(request.endDate).toLocaleDateString()}`;
  };
  
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <h3 className="text-base font-medium mb-2">Seleccione solicitudes para simular</h3>
            <div className="mb-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddAllRequests}
                disabled={pendingRequests.length === 0}
              >
                Seleccionar todas
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearSelection}
                disabled={selectedRequests.length === 0}
              >
                Limpiar
              </Button>
            </div>
            
            <div className="border rounded-md max-h-[400px] overflow-y-auto">
              {pendingRequests.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No hay solicitudes pendientes para simular
                </div>
              ) : (
                <div className="divide-y">
                  {pendingRequests.map((request) => {
                    const workerName = getWorkerName(request.userId);
                    const isSelected = selectedRequests.includes(request.id);
                    
                    return (
                      <div 
                        key={request.id}
                        className={`p-3 flex items-center cursor-pointer hover:bg-muted/50 ${isSelected ? 'bg-primary/10' : ''}`}
                        onClick={() => handleSelectRequest(request.id)}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="mr-3"
                        />
                        <div>
                          <div className="font-medium">{workerName}</div>
                          <div className="text-xs text-muted-foreground">
                            {getRequestDates(request)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            <Button
              className="mt-4 w-full"
              onClick={handleRunSimulation}
              disabled={selectedRequests.length === 0 || isRunning}
            >
              {isRunning ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full mr-2" />
                  Ejecutando simulación...
                </>
              ) : (
                'Ejecutar Simulación'
              )}
            </Button>
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <h3 className="text-base font-medium mb-2">Resultados de la simulación</h3>
            
            {!simulationResult && !isRunning && (
              <div className="border rounded-md p-8 text-center text-muted-foreground h-[400px] flex items-center justify-center">
                <div>
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>Ejecute una simulación para ver los resultados</p>
                </div>
              </div>
            )}
            
            {isRunning && (
              <div className="border rounded-md p-8 text-center h-[400px] flex items-center justify-center">
                <div>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Ejecutando simulación...</p>
                </div>
              </div>
            )}
            
            {simulationResult && !isRunning && (
              <div className="border rounded-md p-4 h-[400px] overflow-y-auto">
                <div className="mb-4 flex items-center">
                  {simulationResult.success ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span className="font-medium">Simulación exitosa</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-amber-600">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      <span className="font-medium">Se detectaron conflictos</span>
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <p className="text-sm mb-1">Cobertura de servicios:</p>
                  <div className="flex items-center gap-2">
                    <Progress value={simulationResult.scheduleCoverage} className="flex-1" />
                    <Badge 
                      className={
                        simulationResult.scheduleCoverage > 80 
                          ? "bg-green-500" 
                          : simulationResult.scheduleCoverage > 60 
                            ? "bg-yellow-500" 
                            : "bg-red-500"
                      }
                    >
                      {simulationResult.scheduleCoverage}%
                    </Badge>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Recomendación:</p>
                  <div className="p-3 border rounded-md bg-muted/30">
                    {simulationResult.recommendation}
                  </div>
                </div>
                
                {simulationResult.conflicts.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Conflictos detectados:</p>
                    <div className="space-y-2">
                      {simulationResult.conflicts.map((conflict, index) => (
                        <div key={index} className="flex items-start p-2 border rounded-md text-sm">
                          <XCircle className="h-4 w-4 mr-2 text-red-500 mt-0.5 flex-shrink-0" />
                          <span>{conflict}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <p className="text-sm font-medium mb-2">Trabajadores afectados:</p>
                  <div className="flex flex-wrap gap-2">
                    {simulationResult.affectedWorkers.map((userId) => (
                      <Badge key={userId} variant="outline">
                        {getWorkerName(userId)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
