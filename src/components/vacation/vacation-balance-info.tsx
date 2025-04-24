
import { User, WorkGroup } from "@/types";
import { getVacationRules } from "@/utils/vacationLogic";

interface VacationBalanceInfoProps {
  user: User;
  remainingDays: number;
  totalDays: number;
}

export function VacationBalanceInfo({ user, remainingDays, totalDays }: VacationBalanceInfoProps) {
  return (
    <div className="px-4 py-3 bg-primary/10 rounded-lg">
      <p className="text-sm">
        <strong>Tu grupo de trabajo:</strong> {user.workGroup}
      </p>
      <p className="text-sm">
        <strong>Regla vacacional:</strong>{" "}
        {getVacationRules(user.workGroup as WorkGroup)}
      </p>
      <p className="text-sm">
        <strong>Días disponibles:</strong> {remainingDays} de {totalDays} días 
        {user.seniority > 0 && (
          <span className="text-xs"> (incluye {Math.floor(user.seniority / 5)} días adicionales por antigüedad)</span>
        )}
      </p>
    </div>
  );
}
