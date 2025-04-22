
import { User, Users, Calendar, AlertTriangle, FileCheck } from "lucide-react";
import { StatsCard } from "./stats-card";

interface HRStatsProps {
  totalWorkers: number;
  pendingRequests: number;
  approvedRequests: number;
  alertsCount: number;
  weeklyRequests: number;
}

export function HRStats({
  totalWorkers,
  pendingRequests,
  approvedRequests,
  alertsCount,
  weeklyRequests,
}: HRStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <StatsCard
        title="Total trabajadores"
        value={totalWorkers}
        icon={<Users className="h-4 w-4" />}
      />
      <StatsCard
        title="Solicitudes pendientes"
        value={pendingRequests}
        icon={<FileCheck className="h-4 w-4" />}
        trend={pendingRequests > 10 ? "up" : "down"}
        trendValue={pendingRequests > 10 ? "Alta demanda" : "Normal"}
      />
      <StatsCard
        title="Solicitudes aprobadas"
        value={approvedRequests}
        icon={<FileCheck className="h-4 w-4" />}
      />
      <StatsCard
        title="Alertas inteligentes"
        value={alertsCount}
        icon={<AlertTriangle className="h-4 w-4" />}
        trend={alertsCount > 5 ? "up" : "down"}
        trendValue={alertsCount > 5 ? "Requiere atención" : "Normal"}
      />
      <StatsCard
        title="Solicitudes esta semana"
        value={weeklyRequests}
        icon={<Calendar className="h-4 w-4" />}
        trend={weeklyRequests > 20 ? "up" : "neutral"}
        trendValue={weeklyRequests > 20 ? "+20% vs semana anterior" : "Normal"}
      />
    </div>
  );
}
