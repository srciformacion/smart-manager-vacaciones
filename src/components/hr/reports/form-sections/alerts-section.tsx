
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, TrendingDown, TrendingUp, Users, Calendar } from "lucide-react";

interface AlertsSectionProps {
  enableAlerts: boolean;
  setEnableAlerts: (enabled: boolean) => void;
  alertTypes: string[];
  setAlertTypes: (types: string[]) => void;
  alertThresholds: Record<string, string>;
  setAlertThresholds: (thresholds: Record<string, string>) => void;
  alertRecipients: string;
  setAlertRecipients: (recipients: string) => void;
}

export function AlertsSection({
  enableAlerts,
  setEnableAlerts,
  alertTypes,
  setAlertTypes,
  alertThresholds,
  setAlertThresholds,
  alertRecipients,
  setAlertRecipients
}: AlertsSectionProps) {
  const availableAlerts = [
    {
      id: "high_absenteeism",
      label: "Alto ausentismo",
      description: "Cuando el ausentismo supere el umbral establecido",
      icon: <TrendingDown className="h-3 w-3 text-red-500" />,
      threshold: "percentage",
      defaultValue: "15"
    },
    {
      id: "overtime_excess",
      label: "Exceso de horas extras",
      description: "Cuando las horas extras superen el límite",
      icon: <TrendingUp className="h-3 w-3 text-orange-500" />,
      threshold: "hours",
      defaultValue: "20"
    },
    {
      id: "vacation_accumulation",
      label: "Acumulación de vacaciones",
      description: "Empleados con muchos días de vacaciones pendientes",
      icon: <Calendar className="h-3 w-3 text-blue-500" />,
      threshold: "days",
      defaultValue: "25"
    },
    {
      id: "understaffing",
      label: "Falta de personal",
      description: "Cuando falte personal en un departamento",
      icon: <Users className="h-3 w-3 text-purple-500" />,
      threshold: "percentage",
      defaultValue: "20"
    },
    {
      id: "pattern_anomalies",
      label: "Anomalías en patrones",
      description: "Detectar patrones inusuales en solicitudes",
      icon: <AlertTriangle className="h-3 w-3 text-yellow-500" />,
      threshold: "percentage",
      defaultValue: "30"
    }
  ];

  const handleEnableAlertsChange = (checked: boolean | "indeterminate") => {
    setEnableAlerts(checked === true);
  };

  const handleAlertTypeChange = (alertId: string, checked: boolean) => {
    if (checked) {
      setAlertTypes([...alertTypes, alertId]);
    } else {
      setAlertTypes(alertTypes.filter(id => id !== alertId));
      // También remover el threshold si se desmarca
      const newThresholds = { ...alertThresholds };
      delete newThresholds[alertId];
      setAlertThresholds(newThresholds);
    }
  };

  const handleThresholdChange = (alertId: string, value: string) => {
    setAlertThresholds({
      ...alertThresholds,
      [alertId]: value
    });
  };

  const getThresholdUnit = (threshold: string) => {
    switch (threshold) {
      case "percentage": return "%";
      case "hours": return "horas";
      case "days": return "días";
      default: return "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="enable-alerts"
          checked={enableAlerts}
          onCheckedChange={handleEnableAlertsChange}
        />
        <Label htmlFor="enable-alerts" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Configurar alertas y notificaciones
        </Label>
      </div>

      {enableAlerts && (
        <div className="ml-6 space-y-4 border-l-2 border-muted pl-4">
          <div className="space-y-3">
            <Label>Tipos de alertas a monitorear</Label>
            <div className="space-y-3">
              {availableAlerts.map((alert) => (
                <div key={alert.id} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={alert.id}
                      checked={alertTypes.includes(alert.id)}
                      onCheckedChange={(checked) => 
                        handleAlertTypeChange(alert.id, checked as boolean)
                      }
                    />
                    <Label htmlFor={alert.id} className="flex items-center gap-2 flex-1">
                      {alert.icon}
                      <div>
                        <div className="font-medium">{alert.label}</div>
                        <div className="text-sm text-muted-foreground">{alert.description}</div>
                      </div>
                    </Label>
                  </div>
                  
                  {alertTypes.includes(alert.id) && (
                    <div className="ml-6 flex items-center gap-2">
                      <Label className="text-sm">Umbral:</Label>
                      <Input
                        type="number"
                        className="w-20"
                        value={alertThresholds[alert.id] || alert.defaultValue}
                        onChange={(e) => handleThresholdChange(alert.id, e.target.value)}
                      />
                      <span className="text-sm text-muted-foreground">
                        {getThresholdUnit(alert.threshold)}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Destinatarios de alertas</Label>
            <Input
              value={alertRecipients}
              onChange={(e) => setAlertRecipients(e.target.value)}
              placeholder="admin@empresa.com, supervisor@empresa.com"
            />
            <div className="text-sm text-muted-foreground">
              Las alertas se enviarán por email cuando se superen los umbrales configurados
            </div>
          </div>

          {alertTypes.length > 0 && (
            <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
              <div className="text-sm font-medium mb-2 text-amber-900">Alertas configuradas:</div>
              <div className="flex flex-wrap gap-1">
                {alertTypes.map((alertId) => {
                  const alert = availableAlerts.find(a => a.id === alertId);
                  return alert ? (
                    <Badge key={alertId} variant="outline" className="bg-amber-100 text-amber-800">
                      {alert.label} ({alertThresholds[alertId] || alert.defaultValue}{getThresholdUnit(alert.threshold)})
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
