
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface AdditionalOptionsProps {
  includeGraphics: boolean;
  setIncludeGraphics: (include: boolean) => void;
  includeSummary: boolean;
  setIncludeSummary: (include: boolean) => void;
}

export function AdditionalOptions({ 
  includeGraphics, 
  setIncludeGraphics, 
  includeSummary, 
  setIncludeSummary 
}: AdditionalOptionsProps) {
  const handleIncludeGraphicsChange = (checked: boolean | "indeterminate") => {
    setIncludeGraphics(checked === true);
  };

  const handleIncludeSummaryChange = (checked: boolean | "indeterminate") => {
    setIncludeSummary(checked === true);
  };

  return (
    <div className="space-y-3">
      <Label>Opciones adicionales</Label>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="graphics"
            checked={includeGraphics}
            onCheckedChange={handleIncludeGraphicsChange}
          />
          <Label htmlFor="graphics" className="text-sm font-normal">
            Incluir gráficos y visualizaciones
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="summary"
            checked={includeSummary}
            onCheckedChange={handleIncludeSummaryChange}
          />
          <Label htmlFor="summary" className="text-sm font-normal">
            Incluir resumen ejecutivo
          </Label>
        </div>
      </div>
    </div>
  );
}
