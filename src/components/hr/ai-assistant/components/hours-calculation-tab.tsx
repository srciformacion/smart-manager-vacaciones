
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileDown } from "lucide-react";
import { HoursCalculationTable } from "@/components/hr/ai-assistant/hours-calculation-table";
import { HoursCalculationResult } from "@/utils/ai/AIService";

interface HoursCalculationTabProps {
  hoursCalculation: HoursCalculationResult[];
  onExport: (type: string) => void;
}

export function HoursCalculationTab({
  hoursCalculation,
  onExport
}: HoursCalculationTabProps) {
  return (
    <div className="m-0 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Cálculo de Horas Anuales</h3>
        <Button variant="outline" size="sm" onClick={() => onExport("hours")}>
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
    </div>
  );
}
