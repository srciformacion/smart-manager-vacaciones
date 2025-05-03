
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CalendarRange, FileText } from "lucide-react";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";

export function CorrectionRequest() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const [reason, setReason] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dateRange?.from || !dateRange?.to) {
      toast.error("Por favor selecciona el rango de fechas a corregir");
      return;
    }
    
    if (!reason.trim()) {
      toast.error("Por favor describe el motivo de la corrección");
      return;
    }
    
    // Aquí iría la lógica para enviar la solicitud
    toast.success("Solicitud de corrección enviada correctamente");
    setReason("");
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Solicitar corrección
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date-range">Periodo a corregir</Label>
            <DatePickerWithRange 
              id="date-range"
              date={dateRange} 
              setDate={setDateRange} 
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Motivo de la corrección</Label>
            <Textarea
              id="reason"
              placeholder="Describe detalladamente el motivo de la corrección de horas..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Enviar solicitud</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
