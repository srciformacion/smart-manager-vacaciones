
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Brain } from "lucide-react";

export function AIAssistantHeader() {
  return (
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
  );
}
