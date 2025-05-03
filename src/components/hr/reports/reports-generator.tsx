
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { toast } from "sonner";
import { Download, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { es } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";

type ReportFormat = 'pdf' | 'excel' | 'csv';
type ReportType = 'turnos' | 'vacaciones' | 'permisos' | 'cambios';

interface ReportsGeneratorProps {
  departmentFilter?: string;
}

export function ReportsGenerator({ departmentFilter }: ReportsGeneratorProps) {
  // Estados para control de formulario
  const [startDate, setStartDate] = useState<Date>(startOfMonth(subMonths(new Date(), 1)));
  const [endDate, setEndDate] = useState<Date>(endOfMonth(new Date()));
  const [reportType, setReportType] = useState<ReportType>('turnos');
  const [reportFormat, setReportFormat] = useState<ReportFormat>('pdf');
  const [department, setDepartment] = useState<string>(departmentFilter || 'todos');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Función para generar el informe
  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    try {
      // Construir parámetros del informe
      const reportParams = {
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        reportType,
        reportFormat,
        department: department === 'todos' ? null : department
      };
      
      // Llamar al endpoint de informes en Supabase
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
      
      // Simular generación
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

  // Función para descargar un informe
  const handleDownloadReport = () => {
    toast.success(`Descargando informe en formato ${reportFormat.toUpperCase()}...`);
  };

  // Función para obtener nombre legible del tipo de informe
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Generador de informes</CardTitle>
        <CardDescription>
          Genere informes personalizados para análisis y gestión
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="nuevo" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="nuevo">Nuevo informe</TabsTrigger>
            <TabsTrigger value="historial">Historial</TabsTrigger>
          </TabsList>
          
          <TabsContent value="nuevo" className="space-y-4">
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
                disabled={!!departmentFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los departamentos</SelectItem>
                  <SelectItem value="Atención al cliente">Atención al cliente</SelectItem>
                  <SelectItem value="Recursos Humanos">Recursos Humanos</SelectItem>
                  <SelectItem value="Operaciones">Operaciones</SelectItem>
                  <SelectItem value="Administración">Administración</SelectItem>
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
          </TabsContent>
          
          <TabsContent value="historial" className="space-y-4">
            <div className="overflow-hidden rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-10 px-4 text-left font-medium">Fecha</th>
                    <th className="h-10 px-4 text-left font-medium">Tipo</th>
                    <th className="h-10 px-4 text-left font-medium">Formato</th>
                    <th className="h-10 px-4 text-left font-medium">Estado</th>
                    <th className="h-10 px-4 text-left font-medium">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4">{format(new Date(), 'PP', { locale: es })}</td>
                    <td className="p-4">Informe de turnos</td>
                    <td className="p-4 flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      PDF
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center rounded-full border border-green-500/30 px-2.5 py-0.5 text-xs font-semibold bg-green-500/10 text-green-700">
                        Completado
                      </span>
                    </td>
                    <td className="p-4">
                      <Button variant="ghost" size="icon" onClick={handleDownloadReport}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">{format(subMonths(new Date(), 1), 'PP', { locale: es })}</td>
                    <td className="p-4">Informe de vacaciones</td>
                    <td className="p-4 flex items-center">
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      Excel
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center rounded-full border border-green-500/30 px-2.5 py-0.5 text-xs font-semibold bg-green-500/10 text-green-700">
                        Completado
                      </span>
                    </td>
                    <td className="p-4">
                      <Button variant="ghost" size="icon" onClick={handleDownloadReport}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
