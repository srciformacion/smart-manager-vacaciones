
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Euro, Clock, Calculator } from "lucide-react";

interface OvertimeCostsSectionProps {
  includeOvertimeCosts: boolean;
  setIncludeOvertimeCosts: (value: boolean) => void;
  includePositionAnalysis: boolean;
  setIncludePositionAnalysis: (value: boolean) => void;
  includeSeniorityAnalysis: boolean;
  setIncludeSeniorityAnalysis: (value: boolean) => void;
  includeDetailedBreakdown: boolean;
  setIncludeDetailedBreakdown: (value: boolean) => void;
}

export function OvertimeCostsFormSection({
  includeOvertimeCosts,
  setIncludeOvertimeCosts,
  includePositionAnalysis,
  setIncludePositionAnalysis,
  includeSeniorityAnalysis,
  setIncludeSeniorityAnalysis,
  includeDetailedBreakdown,
  setIncludeDetailedBreakdown
}: OvertimeCostsSectionProps) {
  return (
    <Card className="border-l-4 border-l-green-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Euro className="h-5 w-5 text-green-600" />
          Análisis de Costos de Horas Extras
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Incluye cálculos de costos considerando antigüedad y tipo de trabajador
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="include-overtime-costs" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Incluir análisis de costos de horas extras
            </Label>
            <p className="text-xs text-muted-foreground">
              Calcula el costo real de las horas extras basado en tarifas por posición y antigüedad
            </p>
          </div>
          <Switch
            id="include-overtime-costs"
            checked={includeOvertimeCosts}
            onCheckedChange={setIncludeOvertimeCosts}
          />
        </div>

        {includeOvertimeCosts && (
          <>
            <Separator />
            
            <div className="space-y-4 pl-4 border-l-2 border-l-green-200">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="include-position-analysis">Análisis por posición</Label>
                  <p className="text-xs text-muted-foreground">
                    Desglose de costos por tipo de trabajador (conductor, técnico, etc.)
                  </p>
                </div>
                <Switch
                  id="include-position-analysis"
                  checked={includePositionAnalysis}
                  onCheckedChange={setIncludePositionAnalysis}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="include-seniority-analysis">Análisis por antigüedad</Label>
                  <p className="text-xs text-muted-foreground">
                    Aplicar multiplicadores según años de servicio del trabajador
                  </p>
                </div>
                <Switch
                  id="include-seniority-analysis"
                  checked={includeSeniorityAnalysis}
                  onCheckedChange={setIncludeSeniorityAnalysis}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="include-detailed-breakdown">Desglose detallado por trabajador</Label>
                  <p className="text-xs text-muted-foreground">
                    Tabla detallada con cálculos individuales por empleado
                  </p>
                </div>
                <Switch
                  id="include-detailed-breakdown"
                  checked={includeDetailedBreakdown}
                  onCheckedChange={setIncludeDetailedBreakdown}
                />
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-xs text-blue-800">
                  <div className="font-medium mb-1">Configuración de tarifas:</div>
                  <ul className="space-y-1">
                    <li>• Conductores: €20/hora base (+30% multiplicador)</li>
                    <li>• Técnicos: €18/hora base (+20% multiplicador)</li>
                    <li>• Medicina: €22/hora base (+50% multiplicador)</li>
                    <li>• Enfermería: €16/hora base (+10% multiplicador)</li>
                    <li>• Multiplicador por antigüedad: +10% cada 3 años (máx. +60%)</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
