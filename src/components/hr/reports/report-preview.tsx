
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, Share, Calendar, Users, FileText } from "lucide-react";
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
      default: return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getReportTypeName = (type: string) => {
    switch (type) {
      case "vacations": return "Vacaciones";
      case "permissions": return "Permisos";
      case "attendance": return "Asistencia";
      case "comprehensive": return "Integral";
      default: return "Desconocido";
    }
  };

  const formatFileSize = (type: string) => {
    // Simular tamaños de archivo
    switch (type) {
      case "pdf": return "2.4 MB";
      case "excel": return "1.8 MB";
      case "csv": return "245 KB";
      default: return "1.2 MB";
    }
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
            <span className="font-medium">Generado el:</span>
            <p className="text-muted-foreground">
              {format(reportConfig.generatedAt, "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
            </p>
          </div>
          <div>
            <span className="font-medium">Opciones:</span>
            <div className="space-y-1">
              {reportConfig.includeGraphics && (
                <Badge variant="secondary" className="text-xs mr-1">
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
