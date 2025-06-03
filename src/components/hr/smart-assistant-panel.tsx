
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Calendar, Clock, FileCheck, Users } from "lucide-react";
import { WorkGroup } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Tipos para las alertas
interface OverlapAlert {
  userId: string;
  message: string;
}

interface GroupCrowdingAlert {
  workGroup: WorkGroup;
  startDate: Date;
  endDate: Date;
  count: number;
  message: string;
}

interface PermissionAccumulationAlert {
  userId: string;
  month: number;
  count: number;
  message: string;
}

interface VacationLimitAlert {
  userId: string;
  daysLeft: number;
  message: string;
}

interface SmartAssistantPanelProps {
  overlaps: OverlapAlert[];
  groupCrowding: GroupCrowdingAlert[];
  permissionAccumulation: PermissionAccumulationAlert[];
  vacationLimit: VacationLimitAlert[];
}

export function SmartAssistantPanel({
  overlaps,
  groupCrowding,
  permissionAccumulation,
  vacationLimit,
}: SmartAssistantPanelProps) {
  // Total de alertas
  const totalAlerts =
    overlaps.length +
    groupCrowding.length +
    permissionAccumulation.length +
    vacationLimit.length;

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            La Rioja Cuida - Alertas y recomendaciones
          </CardTitle>
          <CardDescription>
            {totalAlerts === 0
              ? "No hay alertas actualmente. Todo parece estar en orden."
              : `${totalAlerts} alertas detectadas que requieren su atención.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {totalAlerts === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay alertas ni recomendaciones pendientes en este momento.
            </div>
          ) : (
            <div className="space-y-6">
              {/* Solapes entre solicitudes */}
              {overlaps.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Solapes entre solicitudes ({overlaps.length})
                  </h3>
                  <div className="space-y-2">
                    {overlaps.map((alert, index) => (
                      <div
                        key={`overlap-${index}`}
                        className="rounded-lg border p-3 bg-primary/5"
                      >
                        <p className="text-sm">{alert.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Concentración de solicitudes en grupos */}
              {groupCrowding.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Users className="h-5 w-5 text-danger" />
                    Concentración de solicitudes ({groupCrowding.length})
                  </h3>
                  <div className="space-y-2">
                    {groupCrowding.map((alert, index) => (
                      <div
                        key={`crowd-${index}`}
                        className="rounded-lg border p-3 bg-danger/5"
                      >
                        <p className="text-sm font-medium">
                          {alert.workGroup} - {alert.count} solicitudes
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Periodo: {format(new Date(alert.startDate), "PPP", { locale: es })} al{" "}
                          {format(new Date(alert.endDate), "PPP", { locale: es })}
                        </p>
                        <p className="text-sm mt-1">{alert.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Acumulación de permisos */}
              {permissionAccumulation.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-info" />
                    Acumulación de permisos ({permissionAccumulation.length})
                  </h3>
                  <div className="space-y-2">
                    {permissionAccumulation.map((alert, index) => (
                      <div
                        key={`perm-${index}`}
                        className="rounded-lg border p-3 bg-info/5"
                      >
                        <p className="text-sm">{alert.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Límite de vacaciones */}
              {vacationLimit.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Clock className="h-5 w-5 text-warning" />
                    Límite de vacaciones ({vacationLimit.length})
                  </h3>
                  <div className="space-y-2">
                    {vacationLimit.map((alert, index) => (
                      <div
                        key={`vac-${index}`}
                        className="rounded-lg border p-3 bg-warning/5"
                      >
                        <p className="text-sm">{alert.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
