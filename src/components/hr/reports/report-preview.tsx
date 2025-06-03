import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, Share, Calendar, Users, FileText, TrendingUp, UserX, Timer, ShieldCheck, Clock, Mail, Bell } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ReportPreviewProps {
  reportConfig: any;
  onDownload: () => void;
  onShare: () => void;
}

export function ReportPreview({ reportConfig, onDownload, onShare }: ReportPreviewProps) {
  const getReportIcon = (type: string) => {
    switch (type) {
      case "vacations": return <Calendar className="h-5 w-5 text-blue-500" />;
      case "permissions": return <FileText className="h-5 w-5 text-green-500" />;
      case "attendance": return <Users className="h-5 w-5 text-purple-500" />;
      case "productivity": return <TrendingUp className="h-5 w-5 text-emerald-500" />;
      case "absenteeism": return <UserX className="h-5 w-5 text-red-500" />;
      case "overtime": return <Timer className="h-5 w-5 text-orange-500" />;
      case "compliance": return <ShieldCheck className="h-5 w-5 text-indigo-500" />;
      default: return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getReportTypeName = (type: string) => {
    switch (type) {
      case "vacations": return "Vacaciones";
      case "permissions": return "Permisos";
      case "attendance": return "Asistencia";
      case "comprehensive": return "Integral";
      case "productivity": return "Productividad";
      case "absenteeism": return "Ausentismo";
      case "overtime": return "Horas Extras";
      case "compliance": return "Cumplimiento";
      default: return "Desconocido";
    }
  };

  const formatFileSize = (type: string) => {
    switch (type) {
      case "pdf": return "2.4 MB";
      case "excel": return "1.8 MB";
      case "csv": return "245 KB";
      default: return "1.2 MB";
    }
  };

  const getEmployeesSummary = () => {
    if (reportConfig.employees === "all") {
      return "Todos los empleados";
    }
    return `${reportConfig.employees.length} empleados seleccionados`;
  };

  const getStatusesSummary = () => {
    if (reportConfig.statuses.length === 4) {
      return "Todos los estados";
    }
    return `${reportConfig.statuses.length} estados seleccionados`;
  };

  const getShiftsSummary = () => {
    if (reportConfig.shifts.length === 6) {
      return "Todos los turnos";
    }
    return `${reportConfig.shifts.length} turnos seleccionados`;
  };

  const getComparisonSummary = () => {
    if (!reportConfig.comparison) return null;
    
    const comparisonTypes = {
      "previous_period": "Período anterior",
      "same_period_last_year": "Mismo período año anterior",
      "custom_period": "Período personalizado",
      "quarterly_comparison": "Comparación trimestral"
    };
    
    return comparisonTypes[reportConfig.comparison.type] || "Comparación configurada";
  };

  const getSchedulingSummary = () => {
    if (!reportConfig.scheduling) return null;
    
    const frequencies = {
      "daily": "Diario",
      "weekly": "Semanal", 
      "monthly": "Mensual",
      "quarterly": "Trimestral"
    };
    
    return `${frequencies[reportConfig.scheduling.frequency]} a las ${reportConfig.scheduling.time}`;
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Vista Previa del Informe
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {getReportIcon(reportConfig.type)}
              <h3 className="text-lg font-semibold">{reportConfig.name}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">
                {getReportTypeName(reportConfig.type)}
              </Badge>
              <Badge variant="outline">
                {reportConfig.format.toUpperCase()}
              </Badge>
              <Badge variant="outline">
                {formatFileSize(reportConfig.format)}
              </Badge>
              {reportConfig.scheduling && (
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  <Clock className="h-3 w-3 mr-1" />
                  Programado
                </Badge>
              )}
              {reportConfig.comparison && (
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Con comparativas
                </Badge>
              )}
              {reportConfig.alerts && (
                <Badge variant="outline" className="bg-red-100 text-red-800">
                  <Bell className="h-3 w-3 mr-1" />
                  Con alertas
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Período:</span>
            <p className="text-muted-foreground">
              {format(reportConfig.dateRange.from, "d 'de' MMMM, yyyy", { locale: es })} - {" "}
              {format(reportConfig.dateRange.to, "d 'de' MMMM, yyyy", { locale: es })}
            </p>
          </div>
          <div>
            <span className="font-medium">Departamentos:</span>
            <p className="text-muted-foreground">
              {reportConfig.departments.length === 8 
                ? "Todos los departamentos" 
                : `${reportConfig.departments.length} departamentos seleccionados`
              }
            </p>
          </div>
          <div>
            <span className="font-medium">Empleados:</span>
            <p className="text-muted-foreground">
              {getEmployeesSummary()}
            </p>
          </div>
          <div>
            <span className="font-medium">Estados:</span>
            <p className="text-muted-foreground">
              {getStatusesSummary()}
            </p>
          </div>
          <div>
            <span className="font-medium">Turnos:</span>
            <p className="text-muted-foreground">
              {getShiftsSummary()}
            </p>
          </div>
          <div>
            <span className="font-medium">Generado el:</span>
            <p className="text-muted-foreground">
              {format(reportConfig.generatedAt, "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
            </p>
          </div>
        </div>

        {/* Nuevas secciones para funcionalidades avanzadas */}
        {reportConfig.scheduling && (
          <div className="space-y-2">
            <span className="font-medium text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Programación automática:
            </span>
            <div className="bg-green-50 p-3 rounded-md border border-green-200">
              <div className="text-sm">
                <div className="font-medium text-green-900 mb-1">{getSchedulingSummary()}</div>
                {reportConfig.scheduling.emailSending && (
                  <div className="flex items-center gap-1 text-green-800">
                    <Mail className="h-3 w-3" />
                    <span>Envío automático por email configurado</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {reportConfig.comparison && (
          <div className="space-y-2">
            <span className="font-medium text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Análisis comparativo:
            </span>
            <Badge variant="outline" className="bg-blue-100 text-blue-800">
              {getComparisonSummary()}
            </Badge>
          </div>
        )}

        {reportConfig.alerts && reportConfig.alerts.types.length > 0 && (
          <div className="space-y-2">
            <span className="font-medium text-sm flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Alertas configuradas:
            </span>
            <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
              <div className="text-sm text-amber-900">
                {reportConfig.alerts.types.length} tipo{reportConfig.alerts.types.length !== 1 ? 's' : ''} de alerta{reportConfig.alerts.types.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <span className="font-medium text-sm">Opciones:</span>
          <div className="flex flex-wrap gap-1">
            {reportConfig.includeGraphics && (
              <Badge variant="secondary" className="text-xs">
                Con gráficos
              </Badge>
            )}
            {reportConfig.includeSummary && (
              <Badge variant="secondary" className="text-xs">
                Con resumen
              </Badge>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button onClick={onDownload} className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            Descargar
          </Button>
          <Button onClick={onShare} variant="outline" className="flex-1">
            <Share className="mr-2 h-4 w-4" />
            Compartir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
