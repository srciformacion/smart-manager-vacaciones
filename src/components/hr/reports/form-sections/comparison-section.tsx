
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, AlertTriangle } from "lucide-react";

interface ComparisonSectionProps {
  enableComparison: boolean;
  setEnableComparison: (enabled: boolean) => void;
  comparisonType: string;
  setComparisonType: (type: string) => void;
  comparisonPeriodStart: Date | undefined;
  setComparisonPeriodStart: (date: Date | undefined) => void;
  comparisonPeriodEnd: Date | undefined;
  setComparisonPeriodEnd: (date: Date | undefined) => void;
}

export function ComparisonSection({
  enableComparison,
  setEnableComparison,
  comparisonType,
  setComparisonType,
  comparisonPeriodStart,
  setComparisonPeriodStart,
  comparisonPeriodEnd,
  setComparisonPeriodEnd
}: ComparisonSectionProps) {
  const comparisonTypes = [
    { 
      value: "previous_period", 
      label: "Período anterior", 
      description: "Comparar con el período inmediatamente anterior" 
    },
    { 
      value: "same_period_last_year", 
      label: "Mismo período año anterior", 
      description: "Comparar con el mismo período del año pasado" 
    },
    { 
      value: "custom_period", 
      label: "Período personalizado", 
      description: "Seleccionar un período específico para comparar" 
    },
    { 
      value: "quarterly_comparison", 
      label: "Comparación trimestral", 
      description: "Comparar con trimestres anteriores" 
    }
  ];

  const handleEnableComparisonChange = (checked: boolean | "indeterminate") => {
    setEnableComparison(checked === true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="enable-comparison"
          checked={enableComparison}
          onCheckedChange={handleEnableComparisonChange}
        />
        <Label htmlFor="enable-comparison" className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Incluir comparativas entre períodos
        </Label>
      </div>

      {enableComparison && (
        <div className="ml-6 space-y-4 border-l-2 border-muted pl-4">
          <div className="space-y-2">
            <Label>Tipo de comparación</Label>
            <Select value={comparisonType} onValueChange={setComparisonType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo de comparación" />
              </SelectTrigger>
              <SelectContent>
                {comparisonTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="space-y-1">
                      <div className="font-medium">{type.label}</div>
                      <div className="text-sm text-muted-foreground">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {comparisonType === "custom_period" && (
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Período de comparación personalizado
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Fecha inicio comparación</Label>
                  <DatePicker
                    selectedDate={comparisonPeriodStart}
                    onSelect={setComparisonPeriodStart}
                    placeholder="Seleccionar fecha inicio"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Fecha fin comparación</Label>
                  <DatePicker
                    selectedDate={comparisonPeriodEnd}
                    onSelect={setComparisonPeriodEnd}
                    placeholder="Seleccionar fecha fin"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
            <div className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <div className="font-medium text-blue-900 mb-1">Análisis comparativo incluido:</div>
                <ul className="text-blue-800 space-y-1">
                  <li>• Variaciones porcentuales</li>
                  <li>• Tendencias y patrones</li>
                  <li>• Gráficos comparativos</li>
                  <li>• Análisis de desviaciones</li>
                  <li>• Métricas de rendimiento</li>
                </ul>
              </div>
            </div>
          </div>

          {comparisonType && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Comparación seleccionada:</Label>
              <Badge variant="outline" className="bg-green-100 text-green-800">
                {comparisonTypes.find(t => t.value === comparisonType)?.label}
              </Badge>
            </div>
          )}

          {comparisonType === "custom_period" && (!comparisonPeriodStart || !comparisonPeriodEnd) && (
            <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 p-2 rounded-md border border-amber-200">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span>Selecciona ambas fechas para el período de comparación personalizado</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
