
import { User } from "@/types";
import { HoursCalculationResult } from "./types";

export class HoursCalculationService {
  constructor(private workers: User[]) {}

  public calculateAnnualHours(): HoursCalculationResult[] {
    return this.workers.map(worker => {
      // Base expected hours
      let baseExpectedHours = worker.workday === "Completa" ? 1800 : 900;
      
      // Adjust for seniority
      const seniorityAdjustment = worker.seniority * 8;
      
      // Special adjustments (mock logic)
      let specialAdjustment = 0;
      if (worker.id === "1") {
        specialAdjustment = 120; // Example reduction
      }
      
      const expectedHours = baseExpectedHours - seniorityAdjustment - specialAdjustment;
      const workedHours = expectedHours + Math.floor(Math.random() * 100) - 50;
      const difference = workedHours - expectedHours;
      const adjustedDifference = difference;
      
      let explanation = "";
      let status: "deficit" | "balanced" | "excess" = "balanced";
      
      if (adjustedDifference < -20) {
        explanation = `${worker.name} tiene un déficit de ${Math.abs(adjustedDifference)} horas respecto al convenio. Se recomienda compensar antes de diciembre.`;
        status = "deficit";
      } else if (adjustedDifference > 20) {
        explanation = `${worker.name} ha trabajado ${adjustedDifference} horas más de las establecidas. Se recomienda compensar con días libres.`;
        status = "excess";
      } else {
        explanation = `${worker.name} tiene un balance de horas adecuado según convenio (diferencia: ${adjustedDifference} horas).`;
        status = "balanced";
      }
      
      return {
        userId: worker.id,
        workedHours,
        expectedHours,
        difference,
        adjustedDifference,
        explanation,
        status
      };
    });
  }
}
