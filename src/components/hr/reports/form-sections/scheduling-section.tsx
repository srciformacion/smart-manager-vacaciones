
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Mail, AlertCircle } from "lucide-react";

interface SchedulingSectionProps {
  enableScheduling: boolean;
  setEnableScheduling: (enabled: boolean) => void;
  scheduleFrequency: string;
  setScheduleFrequency: (frequency: string) => void;
  scheduleTime: string;
  setScheduleTime: (time: string) => void;
  scheduleDayOfWeek: string;
  setScheduleDayOfWeek: (day: string) => void;
  scheduleDayOfMonth: string;
  setScheduleDayOfMonth: (day: string) => void;
  enableEmailSending: boolean;
  setEnableEmailSending: (enabled: boolean) => void;
  emailRecipients: string;
  setEmailRecipients: (recipients: string) => void;
}

export function SchedulingSection({
  enableScheduling,
  setEnableScheduling,
  scheduleFrequency,
  setScheduleFrequency,
  scheduleTime,
  setScheduleTime,
  scheduleDayOfWeek,
  setScheduleDayOfWeek,
  scheduleDayOfMonth,
  setScheduleDayOfMonth,
  enableEmailSending,
  setEnableEmailSending,
  emailRecipients,
  setEmailRecipients
}: SchedulingSectionProps) {
  const frequencies = [
    { value: "daily", label: "Diario", icon: <Clock className="h-3 w-3" /> },
    { value: "weekly", label: "Semanal", icon: <Calendar className="h-3 w-3" /> },
    { value: "monthly", label: "Mensual", icon: <Calendar className="h-3 w-3" /> },
    { value: "quarterly", label: "Trimestral", icon: <Calendar className="h-3 w-3" /> }
  ];

  const daysOfWeek = [
    { value: "monday", label: "Lunes" },
    { value: "tuesday", label: "Martes" },
    { value: "wednesday", label: "Miércoles" },
    { value: "thursday", label: "Jueves" },
    { value: "friday", label: "Viernes" },
    { value: "saturday", label: "Sábado" },
    { value: "sunday", label: "Domingo" }
  ];

  const handleEnableSchedulingChange = (checked: boolean | "indeterminate") => {
    setEnableScheduling(checked === true);
  };

  const handleEnableEmailChange = (checked: boolean | "indeterminate") => {
    setEnableEmailSending(checked === true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="enable-scheduling"
          checked={enableScheduling}
          onCheckedChange={handleEnableSchedulingChange}
        />
        <Label htmlFor="enable-scheduling" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Programar generación automática
        </Label>
      </div>

      {enableScheduling && (
        <div className="ml-6 space-y-4 border-l-2 border-muted pl-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Frecuencia</Label>
              <Select value={scheduleFrequency} onValueChange={setScheduleFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {frequencies.map((freq) => (
                    <SelectItem key={freq.value} value={freq.value}>
                      <div className="flex items-center gap-2">
                        {freq.icon}
                        {freq.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Hora</Label>
              <Input
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
              />
            </div>
          </div>

          {scheduleFrequency === "weekly" && (
            <div className="space-y-2">
              <Label>Día de la semana</Label>
              <Select value={scheduleDayOfWeek} onValueChange={setScheduleDayOfWeek}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un día" />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map((day) => (
                    <SelectItem key={day.value} value={day.value}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {scheduleFrequency === "monthly" && (
            <div className="space-y-2">
              <Label>Día del mes</Label>
              <Select value={scheduleDayOfMonth} onValueChange={setScheduleDayOfMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un día" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                    <SelectItem key={day} value={day.toString()}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="enable-email"
                checked={enableEmailSending}
                onCheckedChange={handleEnableEmailChange}
              />
              <Label htmlFor="enable-email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Enviar por email automáticamente
              </Label>
            </div>

            {enableEmailSending && (
              <div className="ml-6 space-y-2">
                <Label>Destinatarios (separados por comas)</Label>
                <Input
                  value={emailRecipients}
                  onChange={(e) => setEmailRecipients(e.target.value)}
                  placeholder="admin@empresa.com, rrhh@empresa.com"
                />
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Los informes se enviarán automáticamente a estos destinatarios según la programación configurada.</span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-muted/50 p-3 rounded-md">
            <div className="text-sm font-medium mb-2">Resumen de programación:</div>
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline">
                {frequencies.find(f => f.value === scheduleFrequency)?.label}
              </Badge>
              <Badge variant="outline">
                {scheduleTime}
              </Badge>
              {scheduleFrequency === "weekly" && scheduleDayOfWeek && (
                <Badge variant="outline">
                  {daysOfWeek.find(d => d.value === scheduleDayOfWeek)?.label}
                </Badge>
              )}
              {scheduleFrequency === "monthly" && scheduleDayOfMonth && (
                <Badge variant="outline">
                  Día {scheduleDayOfMonth}
                </Badge>
              )}
              {enableEmailSending && (
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  Con envío por email
                </Badge>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
