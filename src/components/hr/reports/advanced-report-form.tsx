
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { BasicInfoSection } from "./form-sections/basic-info-section";
import { ReportTypeSection } from "./form-sections/report-type-section";
import { DateRangeSection } from "./form-sections/date-range-section";
import { DepartmentSelection } from "./form-sections/department-selection";
import { AdditionalOptions } from "./form-sections/additional-options";

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
          <BasicInfoSection
            reportName={reportName}
            setReportName={setReportName}
            format={format}
            setFormat={setFormat}
          />

          <ReportTypeSection
            reportType={reportType}
            setReportType={setReportType}
          />

          <DateRangeSection
            dateFrom={dateFrom}
            setDateFrom={setDateFrom}
            dateTo={dateTo}
            setDateTo={setDateTo}
          />

          <Separator />

          <DepartmentSelection
            departments={departments}
            setDepartments={setDepartments}
          />

          <Separator />

          <AdditionalOptions
            includeGraphics={includeGraphics}
            setIncludeGraphics={setIncludeGraphics}
            includeSummary={includeSummary}
            setIncludeSummary={setIncludeSummary}
          />

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
