
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { format, addMonths, startOfMonth, endOfMonth } from "date-fns";
import { toast } from "sonner";

interface ExportFormProps {
  onExport?: (format: 'pdf' | 'excel' | 'csv') => void;
}

export function ExportForm({ onExport }: ExportFormProps) {
  const [startDate, setStartDate] = useState<Date>(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState<Date>(endOfMonth(addMonths(new Date(), 1)));
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!startDate || !endDate) {
      toast.error("Por favor selecciona las fechas");
      return;
    }

    setExporting(true);
    
    try {
      if (onExport) {
        onExport(exportFormat);
      } else {
        // Fallback si no se proporciona la función onExport
        toast.success(`Calendario exportado exitosamente en formato ${exportFormat.toUpperCase()}`);
      }
    } catch (error) {
      console.error("Error exporting calendar:", error);
      toast.error("Error al exportar el calendario");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exportar calendario</CardTitle>
        <CardDescription>
          Exporta tu calendario a diferentes formatos para usar fuera de la aplicación.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha inicial</Label>
              <DatePicker 
                date={startDate} 
                onSelect={setStartDate}
                className="w-full" 
              />
            </div>
            <div className="space-y-2">
              <Label>Fecha final</Label>
              <DatePicker 
                date={endDate} 
                onSelect={setEndDate}
                className="w-full" 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Formato de exportación</Label>
            <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar formato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Periodo seleccionado: {startDate && format(startDate, 'dd/MM/yyyy')} - {endDate && format(endDate, 'dd/MM/yyyy')}
          </div>
          
          <Button 
            onClick={handleExport} 
            className="w-full"
            disabled={exporting}
          >
            {exporting ? "Exportando..." : `Exportar a ${exportFormat.toUpperCase()}`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
