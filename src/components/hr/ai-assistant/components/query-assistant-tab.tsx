
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, AlertCircle } from "lucide-react";
import { AIQueryResponse } from "@/utils/ai/AIService";

interface QueryAssistantTabProps {
  query: string;
  setQuery: (value: string) => void;
  aiResponse: AIQueryResponse | null;
  isLoading: boolean;
  scrollAreaRef: React.RefObject<HTMLDivElement>;
  onSubmitQuery: () => void;
}

export function QueryAssistantTab({
  query,
  setQuery,
  aiResponse,
  isLoading,
  scrollAreaRef,
  onSubmitQuery
}: QueryAssistantTabProps) {
  return (
    <div className="m-0">
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
                if (e.key === 'Enter') onSubmitQuery();
              }}
              className="flex-1"
            />
            <Button onClick={onSubmitQuery} disabled={isLoading}>
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
    </div>
  );
}
