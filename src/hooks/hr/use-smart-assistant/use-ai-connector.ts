
import { useState, useEffect } from "react";
import { getAIConnector, AIConnector } from "@/utils/ai/ai-connector";
import { AIQueryResponse } from "@/utils/ai/types";
import { useToast } from "@/components/ui/use-toast";

export function useAIConnector() {
  const [connector, setConnector] = useState<AIConnector | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<AIQueryResponse | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    try {
      // Recuperar la configuración guardada
      const savedType = localStorage.getItem('aiConnectorType') || 'mock';
      const savedApiKey = localStorage.getItem('aiApiKey') || '';
      
      // Inicializar el conector
      const aiConnector = getAIConnector(savedType, savedApiKey);
      setConnector(aiConnector);
      console.log("AI connector initialized:", savedType);
    } catch (error) {
      console.error("Error initializing AI connector:", error);
      toast({
        variant: "destructive",
        title: "Error de configuración",
        description: "No se pudo inicializar el conector de IA"
      });
    }
  }, [toast]);
  
  const queryAI = async (prompt: string): Promise<AIQueryResponse> => {
    if (!connector) {
      console.error("AI connector not initialized");
      toast({
        variant: "destructive",
        title: "Error de configuración",
        description: "El conector de IA no está inicializado"
      });
      
      // Devolvemos una respuesta de error
      const errorResponse: AIQueryResponse = {
        answer: "Lo siento, no he podido procesar tu consulta porque el sistema de IA no está configurado correctamente.",
        confidence: 0
      };
      setLastResponse(errorResponse);
      return errorResponse;
    }
    
    setIsLoading(true);
    try {
      console.log("Querying AI with prompt:", prompt);
      const response = await connector.query(prompt);
      setLastResponse(response);
      return response;
    } catch (error) {
      console.error("Error al consultar la IA:", error);
      toast({
        variant: "destructive",
        title: "Error de consulta",
        description: "No se pudo obtener una respuesta del servicio de IA"
      });
      
      // Devolvemos una respuesta de error
      const errorResponse: AIQueryResponse = {
        answer: "Lo siento, no he podido procesar tu consulta en este momento. Por favor, inténtalo de nuevo más tarde.",
        confidence: 0
      };
      setLastResponse(errorResponse);
      return errorResponse;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateConnector = () => {
    try {
      const savedType = localStorage.getItem('aiConnectorType') || 'mock';
      const savedApiKey = localStorage.getItem('aiApiKey') || '';
      const newConnector = getAIConnector(savedType, savedApiKey);
      setConnector(newConnector);
      
      toast({
        title: "Conector actualizado",
        description: `Usando ahora: ${newConnector.name}`
      });
      
      return newConnector;
    } catch (error) {
      console.error("Error updating AI connector:", error);
      toast({
        variant: "destructive",
        title: "Error de configuración",
        description: "No se pudo actualizar el conector de IA"
      });
      return null;
    }
  };
  
  return {
    connector,
    isLoading,
    lastResponse,
    queryAI,
    updateConnector
  };
}
