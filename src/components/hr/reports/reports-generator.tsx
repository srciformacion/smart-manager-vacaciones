
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportForm } from "./report-form";
import { ReportHistory } from "./report-history";
import { toast } from "sonner";

export function ReportsGenerator() {
  const [activeTab, setActiveTab] = useState("generate");
  const navigate = useNavigate();

  const handleReportGeneration = (reportName: string) => {
    try {
      if (typeof reportName === 'string') {
        toast.success(`Reporte ${reportName} generado con éxito`);
        setActiveTab("history");
      } else {
        throw new Error("Report name is not a string");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Error al generar el reporte");
    }
  };

  const handleViewReport = (reportId: string) => {
    // Here you would normally navigate to a detailed report view
    toast.info(`Visualizando reporte ${reportId}`);
  };

  const handleDownloadReport = (reportId: string) => {
    // Here you would normally trigger a download
    toast.info(`Descargando reporte ${reportId}`);
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Generador de Reportes</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="generate">Generar Reporte</TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
          </TabsList>
          <TabsContent value="generate">
            <ReportForm onSubmit={handleReportGeneration} />
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
