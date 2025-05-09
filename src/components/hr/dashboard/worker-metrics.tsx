
import { User } from "@/types";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Users, Clock, Building2, Layers } from "lucide-react";
import { useMemo } from "react";

interface WorkerMetricsProps {
  workers: User[];
}

export function WorkerMetrics({ workers }: WorkerMetricsProps) {
  const metrics = useMemo(() => {
    const departments = new Set(workers.map(worker => worker.department).filter(Boolean));
    const shifts = new Set(workers.map(worker => worker.shift).filter(Boolean));
    const workGroups = new Set(workers.map(worker => worker.workGroup).filter(Boolean));
    
    // Calculate average seniority
    const totalSeniority = workers.reduce((sum, worker) => 
      sum + (worker.seniority || 0), 0);
    const avgSeniority = workers.length > 0 
      ? (totalSeniority / workers.length).toFixed(1) 
      : "0";
    
    return {
      departmentsCount: departments.size,
      shiftsCount: shifts.size,
      workGroupsCount: workGroups.size,
      avgSeniority
    };
  }, [workers]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Departamentos"
        value={metrics.departmentsCount}
        icon={<Building2 className="h-4 w-4" />}
      />
      <StatsCard
        title="Turnos"
        value={metrics.shiftsCount}
        icon={<Clock className="h-4 w-4" />}
      />
      <StatsCard
        title="Grupos de Trabajo"
        value={metrics.workGroupsCount}
        icon={<Layers className="h-4 w-4" />}
      />
      <StatsCard
        title="Antigüedad media"
        value={metrics.avgSeniority}
        description="años de servicio"
        icon={<Users className="h-4 w-4" />}
      />
    </div>
  );
}
