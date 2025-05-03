
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { FileDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ExportForm() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 30),
  });
  const [format, setFormat] = useState<string>("pdf");
  const [includeDetails, setIncludeDetails] = useState(true);
  const [includeStats, setIncludeStats] = useState(true);
  
  const handleExport = () => {
    if (!dateRange?.from || !dateRange?.to) {
      toast.error("Por favor selecciona un rango de fechas");
      return;
    }
    
    toast.success(`Exportando calendario en formato ${format.toUpperCase()}...`);
    
    // Simulación de exportación
    setTimeout(() => {
      toast.success(`Calendario exportado exitosamente en formato ${format.toUpperCase()}`);
    }, 1500);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <FileDown className="w-4 h-4" />
          Exportar calendario
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="export-date-range">Periodo a exportar</Label>
          <DatePickerWithRange 
            date={dateRange} 
            setDate={setDateRange} 
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="export-format">Formato de exportación</Label>
          <Select defaultValue="pdf" onValueChange={setFormat}>
            <SelectTrigger id="export-format">
              <SelectValue placeholder="Selecciona un formato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Opciones</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="include-details" 
                checked={includeDetails} 
                onCheckedChange={(checked) => setIncludeDetails(!!checked)} 
              />
              <Label htmlFor="include-details">Incluir desglose detallado</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="include-stats" 
                checked={includeStats} 
                onCheckedChange={(checked) => setIncludeStats(!!checked)} 
              />
              <Label htmlFor="include-stats">Incluir estadísticas y resumen</Label>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleExport} className="w-full">Exportar</Button>
      </CardFooter>
    </Card>
  );
}
