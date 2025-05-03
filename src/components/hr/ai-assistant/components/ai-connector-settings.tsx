
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AIConnectorFactory, getAIConnector } from "@/utils/ai/ai-connector";
import { toast } from "@/components/ui/use-toast";

interface AIConnectorSettingsProps {
  onConnectorChange?: () => void;
}

export function AIConnectorSettings({ onConnectorChange }: AIConnectorSettingsProps) {
  const [connectorType, setConnectorType] = useState(localStorage.getItem('aiConnectorType') || 'mock');
  const [apiKey, setApiKey] = useState(localStorage.getItem('aiApiKey') || '');
  const [isConfigured, setIsConfigured] = useState(false);
  
  useEffect(() => {
    setIsConfigured(!!localStorage.getItem('aiConnectorType') && connectorType !== 'mock');
  }, [connectorType]);
  
  const handleConnectorSave = () => {
    localStorage.setItem('aiConnectorType', connectorType);
    if (apiKey) {
      localStorage.setItem('aiApiKey', apiKey);
    }
    
    // Inicializar el conector con la nueva configuración
    const connector = AIConnectorFactory.createConnector(connectorType, apiKey);
    
    toast({
      title: "Configuración guardada",
      description: `Se ha configurado el conector de IA: ${connector.name}`,
    });
    
    setIsConfigured(true);
    
    if (onConnectorChange) {
      onConnectorChange();
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración del Asistente de IA</CardTitle>
        <CardDescription>
          Selecciona y configura el proveedor de IA para potenciar las recomendaciones del asistente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="connector-type">Proveedor de IA</Label>
            <Select 
              value={connectorType} 
              onValueChange={setConnectorType}
            >
              <SelectTrigger id="connector-type">
                <SelectValue placeholder="Selecciona un proveedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mock">IA simulada (sin API)</SelectItem>
                <SelectItem value="huggingface">HuggingFace (gratuito con API key)</SelectItem>
                <SelectItem value="openai">OpenAI (de pago)</SelectItem>
                <SelectItem value="gemini">Google Gemini (de pago)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              {connectorType === 'mock' ? 
                'El modo simulado proporciona respuestas pre-programadas sin conexión a una IA real.' : 
                connectorType === 'huggingface' ?
                'HuggingFace ofrece modelos gratuitos con limitaciones de uso.' :
                'Este servicio requiere una API key válida de pago.'}
            </p>
          </div>
          
          {connectorType !== 'mock' && (
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input 
                id="api-key" 
                type="password" 
                value={apiKey} 
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Introduce tu API key" 
              />
              <p className="text-xs text-muted-foreground mt-1">
                {connectorType === 'huggingface' ? 
                  'Puedes obtener una API key gratuita en huggingface.co' : 
                  connectorType === 'openai' ? 
                  'Requiere una cuenta de OpenAI con crédito disponible.' :
                  'Requiere una cuenta de Google Cloud con facturación activada.'}
              </p>
            </div>
          )}
          
          <Button 
            onClick={handleConnectorSave} 
            className="w-full mt-4"
          >
            Guardar configuración
          </Button>
          
          {isConfigured && (
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md mt-4">
              <p className="text-green-600 dark:text-green-400 text-sm">
                Conector configurado correctamente: {getAIConnector().name}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
