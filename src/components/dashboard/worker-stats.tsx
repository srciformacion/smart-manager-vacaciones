
import { UserRole, Balance } from "@/types";
import { StatsCard } from "./stats-card";
import { Calendar, Clock, FileCheck, User } from "lucide-react";

interface WorkerStatsProps {
  userRole: UserRole;
  balance: Balance;
  pendingRequests: number;
  approvedRequests: number;
}

export function WorkerStats({
  userRole,
  balance,
  pendingRequests,
  approvedRequests,
}: WorkerStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Días de vacaciones"
        value={balance.vacationDays}
        description="Días disponibles este año"
        icon={<Calendar className="h-4 w-4" />}
      />
      <StatsCard
        title="Asuntos propios"
        value={balance.personalDays}
        description="Días disponibles este año"
        icon={<Clock className="h-4 w-4" />}
      />
      <StatsCard
        title="Permisos justificados"
        value={balance.leaveDays}
        description="Días disponibles este año"
        icon={<FileCheck className="h-4 w-4" />}
      />
      <StatsCard
        title="Solicitudes pendientes"
        value={pendingRequests}
        description={`${approvedRequests} solicitudes aprobadas`}
        icon={<User className="h-4 w-4" />}
      />
    </div>
  );
}
