
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { format, addMonths, startOfMonth, endOfMonth } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ExportFormProps {
  onExport?: (format: 'pdf' | 'excel' | 'csv') => void;
}

export function ExportForm({ onExport }: ExportFormProps) {
  const [startDate, setStartDate] = useState<Date>(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState<Date>(endOfMonth(addMonths(new Date(), 1)));
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [exporting, setExporting] = useState(false);
  const [previousExports, setPreviousExports] = useState<any[]>([]);

  // Cargar exportaciones previas
  useEffect(() => {
    const fetchPreviousExports = async () => {
      try {
        const { data, error } = await supabase
          .from('requests')
          .select('*')
          .eq('type', 'export')
          .order('createdat', { ascending: false })
          .limit(5);
          
        if (error) throw error;
        
        if (data) {
          setPreviousExports(data);
        }
      } catch (error) {
        console.error("Error fetching previous exports:", error);
      }
    };
    
    fetchPreviousExports();
  }, []);

  const handleExport = async () => {
    if (!startDate || !endDate) {
      toast.error("Por favor selecciona las fechas");
      return;
    }

    setExporting(true);
    
    try {
      // Registrar la exportación en la base de datos
      const exportData = {
        userid: "current-user", // Se actualizaría con el ID real del usuario
        type: "export",
        startdate: startDate.toISOString().split('T')[0],
        enddate: endDate.toISOString().split('T')[0],
        reason: `Exportación en formato ${exportFormat.toUpperCase()}`,
        notes: `Período: ${format(startDate, 'dd/MM/yyyy')} - ${format(endDate, 'dd/MM/yyyy')}`,
        status: "completed",
        createdat: new Date().toISOString(),
        updatedat: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('requests')
        .insert(exportData);
        
      if (error) throw error;
      
      if (onExport) {
        onExport(exportFormat);
      } else {
        // Fallback si no se proporciona la función onExport
        // Simular proceso de exportación
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success(`Calendario exportado exitosamente en formato ${exportFormat.toUpperCase()}`);
      }
      
      // Actualizar la lista de exportaciones previas
      const updatedExports = [
        {
          id: `temp-${Date.now()}`,
          ...exportData
        },
        ...previousExports
      ].slice(0, 5);
      
      setPreviousExports(updatedExports);
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
            <Select value={exportFormat} onValueChange={(value: 'pdf' | 'excel' | 'csv') => setExportFormat(value)}>
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
          
          {previousExports.length > 0 && (
            <div className="mt-6 pt-4 border-t">
              <h4 className="text-sm font-medium mb-2">Exportaciones recientes</h4>
              <div className="space-y-2">
                {previousExports.map((exp) => (
                  <div key={exp.id} className="text-sm flex justify-between items-center border rounded-md p-2">
                    <div>
                      <span>{new Date(exp.createdat).toLocaleDateString()}: </span>
                      <span className="font-medium">{exp.reason}</span>
                    </div>
                    <Button variant="ghost" size="sm">Descargar</Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
