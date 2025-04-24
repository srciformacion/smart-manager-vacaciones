
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { FileText, Download } from "lucide-react";
import { Request, User, Department, RequestType, RequestStatus } from "@/types";

interface ReportsGeneratorProps {
  requests: Request[];
  users: User[];
  departments: Department[];
}

export function ReportsGenerator({ requests, users, departments }: ReportsGeneratorProps) {
  const [reportType, setReportType] = useState<"vacations" | "absences" | "department" | "status">("vacations");
  const [department, setDepartment] = useState<Department | "all">("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(new Date());
  const [dateTo, setDateTo] = useState<Date | undefined>(new Date());
  const [requestStatus, setRequestStatus] = useState<RequestStatus | "all">("all");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = () => {
    setIsGenerating(true);
    
    // Filtrar solicitudes según criterios
    let filteredRequests = requests.filter(request => {
      // Filtro de fechas
      const requestStart = new Date(request.startDate);
      const requestEnd = new Date(request.endDate);
      
      const isInDateRange = (!dateFrom || requestStart >= dateFrom) && 
                           (!dateTo || requestEnd <= dateTo);
      
      // Filtro de estado
      const matchesStatus = requestStatus === "all" || request.status === requestStatus;
      
      // Filtro de departamento (requiere buscar el usuario)
      let matchesDepartment = true;
      if (department !== "all") {
        const user = users.find(u => u.id === request.userId);
        matchesDepartment = user?.department === department;
      }
      
      // Filtro por tipo de reporte
      let matchesReportType = true;
      switch (reportType) {
        case "vacations":
          matchesReportType = request.type === "vacation";
          break;
        case "absences":
          matchesReportType = request.type === "leave" || request.type === "personalDay";
          break;
        default:
          matchesReportType = true;
      }
      
      return isInDateRange && matchesStatus && matchesDepartment && matchesReportType;
    });

    // Simulación de generación de informe (en una aplicación real, se generaría un PDF o Excel)
    console.log("Generando informe con:", {
      reportType,
      department,
      dateFrom,
      dateTo,
      requestStatus,
      resultCount: filteredRequests.length
    });
    
    setTimeout(() => {
      setIsGenerating(false);
      // En una aplicación real, se descargaría el archivo
      alert(`Informe generado con éxito. Contiene ${filteredRequests.length} registros.`);
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Generador de informes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="report-type">Tipo de informe</Label>
            <Select value={reportType} onValueChange={(value) => setReportType(value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione tipo de informe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vacations">Vacaciones</SelectItem>
                <SelectItem value="absences">Ausencias (Permisos y días personales)</SelectItem>
                <SelectItem value="department">Por departamento</SelectItem>
                <SelectItem value="status">Por estado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="department">Departamento</Label>
            <Select value={department} onValueChange={(value) => setDepartment(value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los departamentos</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Fecha desde</Label>
            <DatePicker date={dateFrom} setDate={setDateFrom} />
          </div>
          
          <div className="space-y-2">
            <Label>Fecha hasta</Label>
            <DatePicker date={dateTo} setDate={setDateTo} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Estado de solicitud</Label>
            <Select value={requestStatus} onValueChange={(value) => setRequestStatus(value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="approved">Aprobada</SelectItem>
                <SelectItem value="rejected">Rechazada</SelectItem>
                <SelectItem value="moreInfo">Más información</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <Button onClick={generateReport} disabled={isGenerating}>
            {isGenerating ? (
              <>Generando...</>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Generar informe
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
