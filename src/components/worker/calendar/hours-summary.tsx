
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HourStatusCard } from "./hour-status-card";
import { Clock, Calendar } from "lucide-react";

interface MonthStats {
  month: string;
  workedHours: number;
  expectedHours: number;
  difference: number;
  status: string;
}

interface AnnualStats {
  year: number;
  totalExpected: number;
  totalWorked: number;
  remaining: number;
  extraHours: number;
  status: string;
}

interface HoursSummaryProps {
  monthStats: MonthStats;
  annualStats: AnnualStats | null;
  vacationDays: {
    used: number;
    total: number;
  };
}

export function HoursSummary({
  monthStats,
  annualStats,
  vacationDays
}: HoursSummaryProps) {
  if (!annualStats) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            No hay datos anuales disponibles
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Horas mensuales */}
      <HourStatusCard
        title={`Horas ${monthStats.month}`}
        currentValue={monthStats.workedHours}
        maxValue={monthStats.expectedHours}
        status={monthStats.status as any}
        percentage={(monthStats.workedHours / monthStats.expectedHours) * 100}
        icon={<Clock className="h-4 w-4 inline" />}
        extraInfo={`${monthStats.difference >= 0 ? '+' : ''}${monthStats.difference} horas`}
      />

      {/* Horas anuales */}
      <HourStatusCard
        title={`Horas año ${annualStats.year}`}
        currentValue={annualStats.totalWorked}
        maxValue={annualStats.totalExpected}
        status={annualStats.status as any}
        percentage={Math.min(100, (annualStats.totalWorked / annualStats.totalExpected) * 100)}
        icon={<Clock className="h-4 w-4 inline" />}
        extraInfo={`${annualStats.remaining} horas restantes`}
      />

      {/* Horas extra */}
      <HourStatusCard
        title="Horas extra acumuladas"
        currentValue={annualStats.extraHours}
        maxValue={Math.max(50, annualStats.extraHours)}
        status={annualStats.extraHours > 0 ? "positive" : "neutral"}
        percentage={annualStats.extraHours > 0 ? 100 : 0}
        extraInfo="Horas por encima de lo esperado"
      />

      {/* Días de vacaciones */}
      <HourStatusCard
        title="Días de vacaciones"
        currentValue={vacationDays.total - vacationDays.used}
        maxValue={vacationDays.total}
        status={vacationDays.used < vacationDays.total ? "positive" : "warning"}
        percentage={((vacationDays.total - vacationDays.used) / vacationDays.total) * 100}
        icon={<Calendar className="h-4 w-4 inline" />}
        extraInfo={`${vacationDays.used} días utilizados de ${vacationDays.total}`}
      />
    </div>
  );
}
