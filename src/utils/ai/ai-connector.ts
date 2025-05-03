
import { AIQueryResponse } from "./types";

// Interfaz base para cualquier conector de IA
export interface AIConnector {
  query: (prompt: string) => Promise<AIQueryResponse>;
  name: string;
}

// Implementación base para usar una API de IA genérica
export class GenericAIConnector implements AIConnector {
  private apiKey: string | null;
  private apiUrl: string;
  
  constructor(
    public name: string,
    apiUrl: string,
    apiKey: string | null = null
  ) {
    this.apiKey = apiKey;
    this.apiUrl = apiUrl;
  }
  
  async query(prompt: string): Promise<AIQueryResponse> {
    try {
      if (!this.apiKey && !this.isFreeService()) {
        return {
          answer: "No se ha configurado una clave API. Por favor, configure una clave API en la configuración.",
          confidence: 0
        };
      }
      
      // Simulamos una respuesta para desarrollo
      if (process.env.NODE_ENV === 'development' && !this.apiKey) {
        return this.getMockResponse(prompt);
      }
      
      // Aquí iría la lógica de llamada real a la API
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
        },
        body: JSON.stringify({
          prompt: prompt,
          max_tokens: 150
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error en la API: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return {
        answer: data.choices ? data.choices[0].text : data.response || "No se pudo obtener una respuesta",
        confidence: 0.85,
        relatedData: data
      };
    } catch (error) {
      console.error("Error al consultar la IA:", error);
      return {
        answer: "Ha ocurrido un error al contactar con el servicio de IA. Por favor, inténtalo de nuevo más tarde.",
        confidence: 0
      };
    }
  }
  
  // Comprueba si este servicio no requiere API key
  private isFreeService(): boolean {
    // Servicios que no requieren API key o que tienen un tier gratuito
    const freeServices = ['huggingface', 'free-llm'];
    return freeServices.includes(this.name.toLowerCase());
  }
  
  // Respuestas simuladas para desarrollo
  private getMockResponse(prompt: string): AIQueryResponse {
    const lowercasePrompt = prompt.toLowerCase();
    
    if (lowercasePrompt.includes('vacaciones') && lowercasePrompt.includes('aprobar')) {
      return {
        answer: "Basado en el análisis de las solicitudes actuales, recomendaría aprobar esta solicitud de vacaciones, ya que no hay conflictos con otros miembros del equipo y la cobertura departamental es adecuada.",
        confidence: 0.92
      };
    } else if (lowercasePrompt.includes('horas') && (lowercasePrompt.includes('exceso') || lowercasePrompt.includes('extra'))) {
      return {
        answer: "Hay 5 trabajadores con exceso de horas este mes. Te recomendaría revisar especialmente los casos de Juan Pérez (12 horas extra) y Ana Gómez (9 horas extra).",
        confidence: 0.88
      };
    } else {
      return {
        answer: "He analizado tu consulta. Para obtener una respuesta más precisa, por favor proporciona más detalles sobre el tipo de solicitud, fechas específicas o trabajadores involucrados.",
        confidence: 0.75
      };
    }
  }
}

// Implementación específica para HuggingFace (gratuito con limitaciones)
export class HuggingFaceConnector extends GenericAIConnector {
  constructor(apiKey?: string) {
    super(
      "HuggingFace", 
      "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill",
      apiKey || null
    );
  }
  
  async query(prompt: string): Promise<AIQueryResponse> {
    try {
      // Si no hay API key, devolvemos mensaje
      if (!this.name) {
        return {
          answer: "Para usar HuggingFace, necesitas configurar una API key. Puedes obtener una gratuita en huggingface.co",
          confidence: 0
        };
      }
      
      // Llamada específica para la API de HuggingFace
      const response = await fetch("https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.name}`
        },
        body: JSON.stringify({ inputs: prompt }),
      });
      
      if (!response.ok) {
        throw new Error(`Error en la API de HuggingFace: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return {
        answer: data.generated_text || "No se pudo obtener una respuesta de HuggingFace",
        confidence: 0.7,
        relatedData: data
      };
    } catch (error) {
      console.error("Error al consultar HuggingFace:", error);
      // Si hay error, caemos de nuevo al modo mock
      return super.query(prompt);
    }
  }
}

// Factory para crear el conector apropiado
export class AIConnectorFactory {
  static createConnector(type: string = 'mock', apiKey?: string): AIConnector {
    switch (type.toLowerCase()) {
      case 'huggingface':
        return new HuggingFaceConnector(apiKey);
      case 'openai':
        return new GenericAIConnector("OpenAI", "https://api.openai.com/v1/completions", apiKey);
      case 'gemini':
        return new GenericAIConnector("Gemini", "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent", apiKey);
      case 'mock':
      default:
        return new GenericAIConnector("Mock AI", "", null);
    }
  }
}

// Singleton para acceder al conector actual
let currentConnector: AIConnector | null = null;

export const getAIConnector = (type?: string, apiKey?: string): AIConnector => {
  if (!currentConnector || type) {
    currentConnector = AIConnectorFactory.createConnector(type, apiKey);
  }
  return currentConnector;
};
