
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, FileSpreadsheet, FileText } from "lucide-react";

export interface ReportHistoryProps {
  onViewReport: (reportId: string) => void;
  onDownloadReport: (reportId: string) => void;
}

export function ReportHistory({ onViewReport, onDownloadReport }: ReportHistoryProps) {
  // En una aplicación real, estos informes vendrían de una API o base de datos
  const [reports] = useState([
    {
      id: "rep-001",
      name: "Informe de asistencia Q1 2023",
      type: "attendance",
      date: "2023-03-31",
      format: "excel"
    },
    {
      id: "rep-002",
      name: "Vacaciones departamento IT",
      type: "vacation",
      date: "2023-04-15",
      format: "pdf"
    },
    {
      id: "rep-003",
      name: "Análisis de ausencias 2023",
      type: "absence",
      date: "2023-05-10",
      format: "excel"
    }
  ]);

  return (
    <Card className="border">
      <CardContent className="pt-6">
        {reports.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay informes generados
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3 mb-3 sm:mb-0">
                  {report.format === "excel" ? (
                    <FileSpreadsheet className="h-8 w-8 text-emerald-500" />
                  ) : (
                    <FileText className="h-8 w-8 text-blue-500" />
                  )}
                  <div>
                    <h3 className="font-medium">{report.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {report.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(report.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 sm:flex-initial"
                    onClick={() => onViewReport(report.id)}
                  >
                    <Eye className="mr-1 h-4 w-4" />
                    Ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 sm:flex-initial"
                    onClick={() => onDownloadReport(report.id)}
                  >
                    <Download className="mr-1 h-4 w-4" />
                    Descargar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
