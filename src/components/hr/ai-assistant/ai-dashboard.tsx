
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AreaChart, BarChart, Calendar, Clock, Users, AlertTriangle, Brain } from "lucide-react";
import { useState } from "react";
import { AIService } from "@/utils/ai/AIService";
import { exampleRequests } from "@/data/example-requests";
import { exampleWorkers } from "@/data/example-users";
import { exampleBalances } from "@/data/example-balances";
import { AIAssistantPanel } from "./ai-assistant-panel";
import { useNavigate } from "react-router-dom";

export function AIDashboard() {
  const [showFullPanel, setShowFullPanel] = useState(false);
  const navigate = useNavigate();
  
  // Initialize AI service
  const aiService = new AIService(exampleRequests, exampleWorkers, exampleBalances);
  
  // Get vacation analysis and hours calculation
  const vacationAnalysis = aiService.analyzeVacationRequests();
  const hoursCalculation = aiService.calculateAnnualHours();
  
  // Calculate stats
  const approvalRecommendations = vacationAnalysis.filter(a => a.recommendation === "approve").length;
  const denialRecommendations = vacationAnalysis.filter(a => a.recommendation === "deny").length;
  const reviewRecommendations = vacationAnalysis.filter(a => a.recommendation === "review").length;
  
  const balancedHours = hoursCalculation.filter(h => h.status === "balanced").length;
  const deficitHours = hoursCalculation.filter(h => h.status === "deficit").length;
  const excessHours = hoursCalculation.filter(h => h.status === "excess").length;
  
  // Calculate high severity items
  const highSeverityItems = vacationAnalysis.filter(a => a.severity === "high").length;
  
  return (
    <div className="space-y-8">
      {!showFullPanel ? (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-2">
                <Brain className="h-8 w-8 text-primary" />
                Dashboard del Asistente de IA
              </h2>
              <p className="text-muted-foreground mt-1">
                Resumen de análisis, recomendaciones y métricas generadas por el asistente inteligente
              </p>
            </div>
            <Button onClick={() => setShowFullPanel(true)}>
              Ver Panel Completo
            </Button>
          </div>
          
          {highSeverityItems > 0 && (
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle>Atención requerida</AlertTitle>
              <AlertDescription>
                Existen {highSeverityItems} solicitudes de vacaciones con problemas de alta severidad que requieren revisión inmediata.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Aprobaciones Recomendadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{approvalRecommendations}</div>
                <div className="text-xs text-muted-foreground mt-1">solicitudes</div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-4 w-full"
                  onClick={() => navigate("/rrhh/ai-assistant")}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Ver Análisis
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Denegaciones Recomendadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{denialRecommendations}</div>
                <div className="text-xs text-muted-foreground mt-1">solicitudes</div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-4 w-full"
                  onClick={() => navigate("/rrhh/ai-assistant")}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Ver Análisis
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Desbalances de Horas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500">{deficitHours + excessHours}</div>
                <div className="text-xs text-muted-foreground mt-1">trabajadores</div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-4 w-full"
                  onClick={() => navigate("/rrhh/ai-assistant")}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Ver Cálculos
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Trabajadores Balanceados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-500">{balancedHours}</div>
                <div className="text-xs text-muted-foreground mt-1">trabajadores</div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-4 w-full"
                  onClick={() => navigate("/rrhh/ai-assistant")}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Ver Detalle
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-primary" />
                  Análisis de Solicitudes
                </CardTitle>
                <CardDescription>
                  Distribución de las recomendaciones de aprobación/rechazo
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[250px] flex items-center justify-center">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-full max-w-sm">
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                            Aprobadas
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-green-600">
                            {Math.round((approvalRecommendations / vacationAnalysis.length) * 100)}%
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                        <div style={{ width: `${(approvalRecommendations / vacationAnalysis.length) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-600"></div>
                      </div>
                      
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200">
                            Rechazadas
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-red-600">
                            {Math.round((denialRecommendations / vacationAnalysis.length) * 100)}%
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-red-200">
                        <div style={{ width: `${(denialRecommendations / vacationAnalysis.length) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-600"></div>
                      </div>
                      
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-yellow-600 bg-yellow-200">
                            Revisión manual
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-yellow-600">
                            {Math.round((reviewRecommendations / vacationAnalysis.length) * 100)}%
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-yellow-200">
                        <div style={{ width: `${(reviewRecommendations / vacationAnalysis.length) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-600"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AreaChart className="h-5 w-5 text-primary" />
                  Distribución de Horas de Trabajo
                </CardTitle>
                <CardDescription>
                  Estado de las horas trabajadas por empleados
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[250px] flex items-center justify-center">
                <div className="flex flex-col space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-blue-500" />
                      <span className="text-sm font-medium">Balanceados</span>
                    </div>
                    <span className="text-sm font-bold">{balancedHours} empleados</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-red-500" />
                      <span className="text-sm font-medium">Con déficit</span>
                    </div>
                    <span className="text-sm font-bold">{deficitHours} empleados</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-green-500" />
                      <span className="text-sm font-medium">Con exceso</span>
                    </div>
                    <span className="text-sm font-bold">{excessHours} empleados</span>
                  </div>
                  
                  <div className="w-full h-12 bg-gray-200 rounded-lg overflow-hidden flex">
                    <div 
                      className="bg-blue-500 h-full" 
                      style={{ width: `${(balancedHours / hoursCalculation.length) * 100}%` }}
                    />
                    <div 
                      className="bg-red-500 h-full" 
                      style={{ width: `${(deficitHours / hoursCalculation.length) * 100}%` }}
                    />
                    <div 
                      className="bg-green-500 h-full" 
                      style={{ width: `${(excessHours / hoursCalculation.length) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Panel Completo del Asistente de IA</h2>
            <Button onClick={() => setShowFullPanel(false)} variant="outline">
              Volver al Dashboard
            </Button>
          </div>
          <AIAssistantPanel />
        </div>
      )}
    </div>
  );
}
