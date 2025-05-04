
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { format, subMonths } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { HistoricalReport } from "./types";

// Sample data for the reports history
const sampleReports: HistoricalReport[] = [
  {
    id: "1",
    date: new Date(),
    type: "turnos",
    format: "pdf",
    status: "completed"
  },
  {
    id: "2",
    date: subMonths(new Date(), 1),
    type: "vacaciones",
    format: "excel",
    status: "completed"
  },
];

export function ReportHistory() {
  // Function to download a report
  const handleDownloadReport = (reportId: string, format: string) => {
    toast.success(`Descargando informe en formato ${format.toUpperCase()}...`);
  };

  return (
    <div className="space-y-4">
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
            {sampleReports.map((report) => (
              <tr key={report.id} className="border-b">
                <td className="p-4">{format(report.date, 'PP', { locale: es })}</td>
                <td className="p-4">Informe de {report.type}</td>
                <td className="p-4 flex items-center">
                  {report.format === 'pdf' ? (
                    <FileText className="mr-2 h-4 w-4" />
                  ) : (
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                  )}
                  {report.format.toUpperCase()}
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center rounded-full border border-green-500/30 px-2.5 py-0.5 text-xs font-semibold bg-green-500/10 text-green-700">
                    {report.status === 'completed' ? 'Completado' : 'Pendiente'}
                  </span>
                </td>
                <td className="p-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDownloadReport(report.id, report.format)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
