
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdvancedReportForm } from "./advanced-report-form";
import { ReportHistory } from "./report-history";
import { ReportPreview } from "./report-preview";
import { toast } from "@/hooks/use-toast";

export function EnhancedReportsGenerator() {
  const [activeTab, setActiveTab] = useState("generate");
  const [lastGeneratedReport, setLastGeneratedReport] = useState<any>(null);

  const handleReportGeneration = (reportConfig: any) => {
    setLastGeneratedReport(reportConfig);
    setActiveTab("preview");
  };

  const handleDownload = () => {
    toast({
      title: "Descarga iniciada",
      description: `Descargando ${lastGeneratedReport.name}.${lastGeneratedReport.format}`
    });
  };

  const handleShare = () => {
    toast({
      title: "Enlace copiado",
      description: "El enlace para compartir el informe ha sido copiado al portapapeles"
    });
  };

  const handleViewReport = (reportId: string) => {
    toast({
      title: "Abriendo informe",
      description: `Visualizando informe ${reportId}`
    });
  };

  const handleDownloadReport = (reportId: string) => {
    toast({
      title: "Descarga iniciada",
      description: `Descargando informe ${reportId}`
    });
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sistema de Informes Avanzado</CardTitle>
        <p className="text-muted-foreground">
          Genera informes detallados de vacaciones, permisos y asistencia con opciones avanzadas
        </p>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="generate">Generar Informe</TabsTrigger>
            <TabsTrigger value="preview" disabled={!lastGeneratedReport}>
              Vista Previa
            </TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate">
            <AdvancedReportForm onSubmit={handleReportGeneration} />
          </TabsContent>
          
          <TabsContent value="preview">
            {lastGeneratedReport ? (
              <ReportPreview
                reportConfig={lastGeneratedReport}
                onDownload={handleDownload}
                onShare={handleShare}
              />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Genera un informe para ver la vista previa
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="history">
            <ReportHistory 
              onViewReport={handleViewReport} 
              onDownloadReport={handleDownloadReport} 
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
