
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BasicInfoSectionProps {
  reportName: string;
  setReportName: (name: string) => void;
  format: string;
  setFormat: (format: string) => void;
}

export function BasicInfoSection({ 
  reportName, 
  setReportName, 
  format, 
  setFormat 
}: BasicInfoSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="report-name">Nombre del informe *</Label>
        <Input
          id="report-name"
          value={reportName}
          onChange={(e) => setReportName(e.target.value)}
          placeholder="Informe de vacaciones Q1 2024"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="format">Formato de salida</Label>
        <Select value={format} onValueChange={setFormat}>
          <SelectTrigger id="format">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="excel">Excel (.xlsx)</SelectItem>
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="csv">CSV</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
