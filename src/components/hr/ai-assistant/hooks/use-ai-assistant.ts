
import { useState, useRef } from "react";
import { AIService, AIQueryResponse } from "@/utils/ai/AIService";
import { toast } from "@/hooks/use-toast";
import { useRequests } from "@/hooks/use-requests";
import { exampleRequests } from "@/data/example-requests";
import { exampleWorkers } from "@/data/example-users";
import { exampleBalances } from "@/data/example-balances";
import { useAIConnector } from "@/hooks/hr/use-smart-assistant/use-ai-connector";

export function useAIAssistant() {
  const [activeTab, setActiveTab] = useState("vacation-analysis");
  const [query, setQuery] = useState("");
  const [aiResponse, setAIResponse] = useState<AIQueryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Inicializar servicio AI
  const aiService = new AIService(exampleRequests, exampleWorkers, exampleBalances);
  
  // Obtener el conector de IA personalizable
  const { queryAI, isLoading: connectorLoading, updateConnector } = useAIConnector();
  
  // Obtener el análisis de vacaciones
  const vacationAnalysis = aiService.analyzeVacationRequests();
  
  // Obtener el cálculo de horas
  const hoursCalculation = aiService.calculateAnnualHours();
  
  // Gestionar los cambios de estado de las solicitudes
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
  
  const handleSubmitQuery = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Intentar usar el conector de IA configurado primero
      const response = await queryAI(query);
      setAIResponse(response);
      
    } catch (error) {
      console.error("Error al usar el conector de IA:", error);
      
      // Fallback a la lógica anterior simulada
      setTimeout(() => {
        const response = aiService.processQuery(query);
        setAIResponse(response);
        setIsLoading(false);
        
        // Scroll to result
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
      }, 1000);
    } finally {
      setIsLoading(false);
      
      // Scroll to result
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
      }
    }
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
  
  const handleConnectorChange = () => {
    updateConnector();
    
    toast({
      title: "Configuración actualizada",
      description: "El conector de IA ha sido actualizado correctamente.",
    });
  };
  
  return {
    activeTab,
    setActiveTab,
    query,
    setQuery,
    aiResponse,
    isLoading: isLoading || connectorLoading,
    scrollAreaRef,
    aiService,
    vacationAnalysis,
    hoursCalculation,
    handleApproveRecommendation,
    handleSubmitQuery,
    handleExportData,
    handleConnectorChange
  };
}
