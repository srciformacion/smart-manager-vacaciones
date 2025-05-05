
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";

export interface ReportFormProps {
  onSubmit: (reportName: string) => void;
}

export function ReportForm({ onSubmit }: ReportFormProps) {
  const [reportType, setReportType] = useState("attendance");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(new Date());
  const [dateTo, setDateTo] = useState<Date | undefined>(new Date());
  const [reportName, setReportName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportName.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simular generación de informe
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit(reportName);
      
      // Limpiar formulario
      setReportName("");
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="border">
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="report-name">Nombre del informe</Label>
            <Input
              id="report-name"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              placeholder="Informe de asistencia Q2 2023"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="report-type">Tipo de informe</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger id="report-type">
                <SelectValue placeholder="Seleccione tipo de informe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="attendance">Asistencia</SelectItem>
                <SelectItem value="absence">Ausencias</SelectItem>
                <SelectItem value="vacation">Vacaciones</SelectItem>
                <SelectItem value="personal-days">Días personales</SelectItem>
              </SelectContent>
            </Select>
          </div>

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

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !reportName.trim()}
          >
            {isSubmitting ? "Generando informe..." : "Generar informe"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
