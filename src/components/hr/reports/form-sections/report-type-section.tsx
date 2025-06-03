
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Users, Clock, FileText } from "lucide-react";

interface ReportTypeSectionProps {
  reportType: string;
  setReportType: (type: string) => void;
}

export function ReportTypeSection({ reportType, setReportType }: ReportTypeSectionProps) {
  return (
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
  );
}
