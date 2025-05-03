
import { useState, useEffect } from "react";
import { getAIConnector, AIConnector } from "@/utils/ai/ai-connector";
import { AIQueryResponse } from "@/utils/ai/types";
import { toast } from "@/components/ui/use-toast";

export function useAIConnector() {
  const [connector, setConnector] = useState<AIConnector | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<AIQueryResponse | null>(null);
  
  useEffect(() => {
    // Recuperar la configuración guardada
    const savedType = localStorage.getItem('aiConnectorType') || 'mock';
    const savedApiKey = localStorage.getItem('aiApiKey') || '';
    
    // Inicializar el conector
    const aiConnector = getAIConnector(savedType, savedApiKey);
    setConnector(aiConnector);
  }, []);
  
  const queryAI = async (prompt: string): Promise<AIQueryResponse> => {
    if (!connector) {
      throw new Error("El conector de IA no está inicializado");
    }
    
    setIsLoading(true);
    try {
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
    const savedType = localStorage.getItem('aiConnectorType') || 'mock';
    const savedApiKey = localStorage.getItem('aiApiKey') || '';
    const newConnector = getAIConnector(savedType, savedApiKey);
    setConnector(newConnector);
    
    toast({
      title: "Conector actualizado",
      description: `Usando ahora: ${newConnector.name}`
    });
    
    return newConnector;
  };
  
  return {
    connector,
    isLoading,
    lastResponse,
    queryAI,
    updateConnector
  };
}
