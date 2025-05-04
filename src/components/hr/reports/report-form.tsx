
import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

import { ReportType, ReportFormat } from "./types";

interface ReportFormProps {
  departments: string[];
}

export function ReportForm({ departments }: ReportFormProps) {
  // States for form controls
  const [startDate, setStartDate] = useState<Date>(startOfMonth(subMonths(new Date(), 1)));
  const [endDate, setEndDate] = useState<Date>(endOfMonth(new Date()));
  const [reportType, setReportType] = useState<ReportType>('turnos');
  const [reportFormat, setReportFormat] = useState<ReportFormat>('pdf');
  const [department, setDepartment] = useState<string>('todos');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Function to generate the report
  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    try {
      // Build report parameters
      const reportParams = {
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        reportType,
        reportFormat,
        department: department === 'todos' ? null : department
      };
      
      // Call the reports endpoint in Supabase
      const { data, error } = await supabase
        .from('reports_queue')
        .insert({
          params: reportParams,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();
      
      if (error) throw error;
      
      // Simulate generation
      setTimeout(() => {
        toast.success(`Informe de ${getReportTypeName(reportType)} generado exitosamente en formato ${reportFormat.toUpperCase()}`);
        setIsGenerating(false);
      }, 2000);
      
    } catch (error) {
      console.error("Error al generar informe:", error);
      toast.error("Error al generar el informe. Inténtelo de nuevo.");
      setIsGenerating(false);
    }
  };

  // Function to get readable name for report type
  const getReportTypeName = (type: ReportType): string => {
    switch (type) {
      case 'turnos': return 'turnos';
      case 'vacaciones': return 'vacaciones';
      case 'permisos': return 'permisos';
      case 'cambios': return 'cambios de turno';
      default: return type;
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <Label>Tipo de informe</Label>
          <Select value={reportType} onValueChange={(value: ReportType) => setReportType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="turnos">Informe de turnos</SelectItem>
              <SelectItem value="vacaciones">Informe de vacaciones</SelectItem>
              <SelectItem value="permisos">Informe de permisos</SelectItem>
              <SelectItem value="cambios">Informe de cambios de turno</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Formato</Label>
          <Select value={reportFormat} onValueChange={(value: ReportFormat) => setReportFormat(value)}>
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
      </div>
      
      <div className="space-y-2 mb-6">
        <Label>Departamento</Label>
        <Select 
          value={department} 
          onValueChange={setDepartment}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los departamentos</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        onClick={handleGenerateReport} 
        className="w-full" 
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generando informe...
          </>
        ) : (
          'Generar informe'
        )}
      </Button>
    </div>
  );
}
