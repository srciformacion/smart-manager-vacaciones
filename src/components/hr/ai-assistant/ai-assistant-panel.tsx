
import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileDown, Search, Send, Brain, Calendar, Clock, CheckCircle, AlertCircle, HelpCircle } from "lucide-react";
import { AIService, AIAnalysisResult, HoursCalculationResult, AIQueryResponse } from "@/utils/ai/AIService";
import { toast } from "@/hooks/use-toast";
import { VacationAnalysisTable } from "@/components/hr/ai-assistant/vacation-analysis-table";
import { HoursCalculationTable } from "@/components/hr/ai-assistant/hours-calculation-table";
import { AISimulationPanel } from "@/components/hr/ai-assistant/ai-simulation-panel";
import { useRequests } from "@/hooks/use-requests";
import { exampleRequests } from "@/data/example-requests";
import { exampleWorkers } from "@/data/example-users";
import { exampleBalances } from "@/data/example-balances";

export function AIAssistantPanel() {
  const [activeTab, setActiveTab] = useState("vacation-analysis");
  const [query, setQuery] = useState("");
  const [aiResponse, setAIResponse] = useState<AIQueryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Initialize AI service
  const aiService = new AIService(exampleRequests, exampleWorkers, exampleBalances);
  
  // Get vacation analysis results
  const vacationAnalysis = aiService.analyzeVacationRequests();
  
  // Get hours calculation results
  const hoursCalculation = aiService.calculateAnnualHours();
  
  // Handle request status changes
  const { handleStatusChange } = useRequests(exampleRequests, exampleWorkers);
  
  const handleApproveRecommendation = (requestId: string, recommendation: string) => {
    const request = exampleRequests.find(req => req.id === requestId);
    if (!request) return;
    
    const newStatus = recommendation === "approve" ? "approved" : 
                      recommendation === "deny" ? "rejected" : "pending";
    
    if (newStatus !== "pending") {
      handleStatusChange(request, newStatus);
      
      toast({
        title: `Solicitud ${newStatus === "approved" ? "aprobada" : "rechazada"}`,
        description: `Se ha ${newStatus === "approved" ? "aprobado" : "rechazado"} la solicitud siguiendo la recomendación del asistente.`,
      });
    }
  };
  
  const handleSubmitQuery = () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const response = aiService.processQuery(query);
      setAIResponse(response);
      setIsLoading(false);
      
      // Scroll to result
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
      }
    }, 1000);
  };
  
  const handleExportData = (type: string) => {
    let data: any[] = [];
    let headers: string[] = [];
    let filename = "export.csv";
    
    if (type === "vacation") {
      data = vacationAnalysis.map(a => ({
        id: a.requestId,
        recommendation: a.recommendation,
        explanation: a.explanation,
        severity: a.severity
      }));
      headers = ["id", "recommendation", "explanation", "severity"];
      filename = "vacation-analysis.csv";
    } else if (type === "hours") {
      data = hoursCalculation.map(h => ({
        userId: h.userId,
        workedHours: h.workedHours,
        expectedHours: h.expectedHours,
        difference: h.adjustedDifference,
        status: h.status
      }));
      headers = ["userId", "workedHours", "expectedHours", "difference", "status"];
      filename = "hours-calculation.csv";
    }
    
    if (data.length > 0) {
      // Convert to CSV
      const csvContent = [
        headers.join(","),
        ...data.map(row => 
          headers.map(key => JSON.stringify(row[key] || "")).join(",")
        )
      ].join("\n");
      
      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Exportación completada",
        description: `Se ha generado el archivo ${filename} correctamente.`,
      });
    }
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader className="bg-muted/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              Asistente de IA para Gestión de Recursos
            </CardTitle>
            <CardDescription className="text-sm mt-1">
              Análisis inteligente de vacaciones, jornadas y recomendaciones automáticas
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6 pt-4 border-b">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
              <TabsTrigger value="vacation-analysis" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Análisis de Vacaciones</span>
                <span className="inline sm:hidden">Vacaciones</span>
              </TabsTrigger>
              <TabsTrigger value="hours-calculation" className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">Cálculo de Horas</span>
                <span className="inline sm:hidden">Horas</span>
              </TabsTrigger>
              <TabsTrigger value="simulation" className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                <span>Simulador</span>
              </TabsTrigger>
              <TabsTrigger value="query-assistant" className="flex items-center gap-1">
                <HelpCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Consultas</span>
                <span className="inline sm:hidden">Preguntar</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="vacation-analysis" className="m-0 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Análisis de Solicitudes de Vacaciones</h3>
              <Button variant="outline" size="sm" onClick={() => handleExportData("vacation")}>
                <FileDown className="h-4 w-4 mr-1" />
                Exportar
              </Button>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-green-500">{vacationAnalysis.filter(a => a.recommendation === "approve").length} Aprobaciones</Badge>
                <Badge className="bg-red-500">{vacationAnalysis.filter(a => a.recommendation === "deny").length} Denegaciones</Badge>
                <Badge className="bg-yellow-500">{vacationAnalysis.filter(a => a.recommendation === "review").length} Revisión Manual</Badge>
              </div>
            </div>
            
            <VacationAnalysisTable 
              analysis={vacationAnalysis} 
              onApproveRecommendation={handleApproveRecommendation} 
            />
          </TabsContent>
          
          <TabsContent value="hours-calculation" className="m-0 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Cálculo de Horas Anuales</h3>
              <Button variant="outline" size="sm" onClick={() => handleExportData("hours")}>
                <FileDown className="h-4 w-4 mr-1" />
                Exportar
              </Button>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-green-500">
                  {hoursCalculation.filter(h => h.status === "balanced").length} Balanceados
                </Badge>
                <Badge className="bg-red-500">
                  {hoursCalculation.filter(h => h.status === "deficit").length} Con Déficit
                </Badge>
                <Badge className="bg-blue-500">
                  {hoursCalculation.filter(h => h.status === "excess").length} Con Exceso
                </Badge>
              </div>
            </div>
            
            <HoursCalculationTable calculations={hoursCalculation} />
          </TabsContent>
          
          <TabsContent value="simulation" className="m-0 p-6">
            <AISimulationPanel requests={exampleRequests} workers={exampleWorkers} aiService={aiService} />
          </TabsContent>
          
          <TabsContent value="query-assistant" className="m-0">
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">Asistente de Consultas</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Realice consultas en lenguaje natural sobre vacaciones, horas o personal.
                Ejemplos: "¿Puede Pedro coger vacaciones en agosto?", "¿Qué trabajadores tienen exceso de horas este mes?"
              </p>
              
              <div className="rounded-lg border bg-background p-4">
                <ScrollArea className="h-[300px]" ref={scrollAreaRef as any}>
                  {aiResponse && (
                    <div className="mb-6">
                      <div className="mb-2 text-sm text-muted-foreground">Su consulta:</div>
                      <div className="bg-muted p-3 rounded-lg mb-4">{query}</div>
                      <div className="mb-2 text-sm text-muted-foreground">Respuesta:</div>
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <p>{aiResponse.answer}</p>
                        <div className="mt-2 flex justify-end">
                          <Badge variant={aiResponse.confidence > 0.7 ? "default" : "outline"}>
                            {(aiResponse.confidence * 100).toFixed(0)}% de confianza
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {!aiResponse && !isLoading && (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div className="text-center">
                        <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>Introduzca una consulta para comenzar</p>
                      </div>
                    </div>
                  )}
                  
                  {isLoading && (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p>Procesando consulta...</p>
                      </div>
                    </div>
                  )}
                </ScrollArea>
                
                <div className="flex gap-2 mt-4">
                  <Input 
                    placeholder="Escriba su consulta..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSubmitQuery();
                    }}
                    className="flex-1"
                  />
                  <Button onClick={handleSubmitQuery} disabled={isLoading}>
                    {isLoading ? (
                      <div className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    <span className="ml-2 hidden md:inline">Enviar</span>
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
