
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileDown } from "lucide-react";
import { VacationAnalysisTable } from "@/components/hr/ai-assistant/vacation-analysis";
import { AIAnalysisResult } from "@/utils/ai/AIService";

interface VacationAnalysisTabProps {
  vacationAnalysis: AIAnalysisResult[];
  onApproveRecommendation: (requestId: string, recommendation: string) => void;
  onExport: (type: string) => void;
}

export function VacationAnalysisTab({ 
  vacationAnalysis,
  onApproveRecommendation,
  onExport
}: VacationAnalysisTabProps) {
  return (
    <div className="m-0 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Análisis de Solicitudes de Vacaciones</h3>
        <Button variant="outline" size="sm" onClick={() => onExport("vacation")}>
          <FileDown className="h-4 w-4 mr-1" />
          Exportar
        </Button>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className="bg-green-500">
            {vacationAnalysis.filter(a => a.recommendation === "approve").length} Aprobaciones
          </Badge>
          <Badge className="bg-red-500">
            {vacationAnalysis.filter(a => a.recommendation === "deny").length} Denegaciones
          </Badge>
          <Badge className="bg-yellow-500">
            {vacationAnalysis.filter(a => a.recommendation === "review").length} Revisión Manual
          </Badge>
        </div>
      </div>
      
      <VacationAnalysisTable 
        analysis={vacationAnalysis} 
        onApproveRecommendation={onApproveRecommendation} 
      />
    </div>
  );
}
