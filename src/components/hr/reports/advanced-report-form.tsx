
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { FileText, Download, Calendar, Users, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AdvancedReportFormProps {
  onSubmit: (reportConfig: any) => void;
}

export function AdvancedReportForm({ onSubmit }: AdvancedReportFormProps) {
  const [reportType, setReportType] = useState("vacations");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(new Date());
  const [dateTo, setDateTo] = useState<Date | undefined>(new Date());
  const [reportName, setReportName] = useState("");
  const [format, setFormat] = useState("excel");
  const [departments, setDepartments] = useState<string[]>([]);
  const [includeGraphics, setIncludeGraphics] = useState(true);
  const [includeSummary, setIncludeSummary] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const departmentOptions = [
    "Enfermería", "Medicina", "Administración", "Limpieza", 
    "Seguridad", "Cocina", "Mantenimiento", "Dirección"
  ];

  const handleDepartmentChange = (dept: string, checked: boolean) => {
    if (checked) {
      setDepartments([...departments, dept]);
    } else {
      setDepartments(departments.filter(d => d !== dept));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor, introduce un nombre para el informe"
      });
      return;
    }

    setIsGenerating(true);

    const reportConfig = {
      name: reportName,
      type: reportType,
      format,
      dateRange: { from: dateFrom, to: dateTo },
      departments: departments.length > 0 ? departments : departmentOptions,
      includeGraphics,
      includeSummary,
      generatedAt: new Date()
    };

    // Simular generación
    setTimeout(() => {
      setIsGenerating(false);
      onSubmit(reportConfig);
      
      // Limpiar formulario
      setReportName("");
      setDepartments([]);
      
      toast({
        title: "Informe generado",
        description: `El informe "${reportName}" ha sido generado exitosamente`,
      });
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Configuración Avanzada de Informes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="report-name">Nombre del informe *</Label>
              <Input
                id="report-name"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="Informe de vacaciones Q1 2024"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="format">Formato de salida</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger id="format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tipo de informe */}
          <div className="space-y-2">
            <Label htmlFor="report-type">Tipo de informe</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger id="report-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vacations">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Informe de Vacaciones
                  </div>
                </SelectItem>
                <SelectItem value="permissions">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Informe de Permisos
                  </div>
                </SelectItem>
                <SelectItem value="attendance">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Informe de Asistencia
                  </div>
                </SelectItem>
                <SelectItem value="comprehensive">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Informe Integral
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Rango de fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha desde</Label>
              <DatePicker
                selectedDate={dateFrom}
                onSelect={setDateFrom}
              />
            </div>
            <div className="space-y-2">
              <Label>Fecha hasta</Label>
              <DatePicker
                selectedDate={dateTo}
                onSelect={setDateTo}
              />
            </div>
          </div>

          <Separator />

          {/* Departamentos */}
          <div className="space-y-3">
            <Label>Departamentos a incluir</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {departmentOptions.map((dept) => (
                <div key={dept} className="flex items-center space-x-2">
                  <Checkbox
                    id={dept}
                    checked={departments.includes(dept)}
                    onCheckedChange={(checked) => 
                      handleDepartmentChange(dept, checked as boolean)
                    }
                  />
                  <Label htmlFor={dept} className="text-sm font-normal">
                    {dept}
                  </Label>
                </div>
              ))}
            </div>
            {departments.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Si no seleccionas ninguno, se incluirán todos los departamentos
              </p>
            )}
          </div>

          <Separator />

          {/* Opciones adicionales */}
          <div className="space-y-3">
            <Label>Opciones adicionales</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="graphics"
                  checked={includeGraphics}
                  onCheckedChange={setIncludeGraphics}
                />
                <Label htmlFor="graphics" className="text-sm font-normal">
                  Incluir gráficos y visualizaciones
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="summary"
                  checked={includeSummary}
                  onCheckedChange={setIncludeSummary}
                />
                <Label htmlFor="summary" className="text-sm font-normal">
                  Incluir resumen ejecutivo
                </Label>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isGenerating || !reportName.trim()}
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Generando informe...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Generar informe
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
