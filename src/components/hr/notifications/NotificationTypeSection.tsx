
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { NotificationTypeSectionProps } from "./types";

export function NotificationTypeSection({ value, onChange }: NotificationTypeSectionProps) {
  return (
    <div className="space-y-2">
      <Label>Tipo de notificación</Label>
      <Select 
        value={value} 
        onValueChange={onChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="requestApproved">Solicitud aprobada</SelectItem>
          <SelectItem value="requestRejected">Solicitud rechazada</SelectItem>
          <SelectItem value="shiftAssigned">Nuevo turno asignado</SelectItem>
          <SelectItem value="calendarChanged">Cambio en calendario</SelectItem>
          <SelectItem value="chatMessage">Mensaje de chat</SelectItem>
          <SelectItem value="documentReminder">Recordatorio de documento</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
