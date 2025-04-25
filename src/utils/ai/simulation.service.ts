
import { Request, User } from "@/types";
import { SimulationResult } from "./types";
import { analyzeStaffingConflicts } from "@/utils/vacation/staffing";

export class SimulationService {
  constructor(
    private requests: Request[],
    private workers: User[]
  ) {}

  public simulateApproval(requestIds: string[]): SimulationResult {
    const requestsToSimulate = this.requests.filter(req => requestIds.includes(req.id));
    
    if (requestsToSimulate.length === 0) {
      return {
        success: false,
        conflicts: ["No se encontraron solicitudes para simular."],
        recommendation: "No se puede realizar la simulación sin solicitudes válidas.",
        affectedWorkers: [],
        scheduleCoverage: 100
      };
    }
    
    const conflicts: string[] = [];
    const affectedWorkers: string[] = [];
    let totalCoverageImpact = 0;
    
    requestsToSimulate.forEach(request => {
      const worker = this.workers.find(w => w.id === request.userId);
      if (!worker) return;
      
      affectedWorkers.push(worker.id);
      
      // Check overlaps
      const overlapping = this.getOverlappingRequests(request);
      if (overlapping.length > 0) {
        conflicts.push(`Solicitud ${request.id} se solapa con otras ${overlapping.length} solicitudes.`);
      }
      
      // Check staffing
      const staffingAnalysis = analyzeStaffingConflicts(
        new Date(request.startDate),
        new Date(request.endDate),
        worker.department,
        this.requests,
        this.workers
      );
      
      if (staffingAnalysis.hasConflict) {
        conflicts.push(staffingAnalysis.message);
        totalCoverageImpact += 10;
      }
    });
    
    const scheduleCoverage = Math.max(0, 100 - totalCoverageImpact);
    
    let recommendation = "";
    if (conflicts.length === 0) {
      recommendation = "Se pueden aprobar todas las solicitudes sin impacto significativo.";
    } else if (conflicts.length < 3) {
      recommendation = "Existen algunos conflictos, pero podrían resolverse con ajustes menores.";
    } else {
      recommendation = "No se recomienda aprobar todas estas solicitudes simultáneamente debido a múltiples conflictos.";
    }
    
    return {
      success: conflicts.length === 0,
      conflicts,
      recommendation,
      affectedWorkers: [...new Set(affectedWorkers)],
      scheduleCoverage
    };
  }

  private getOverlappingRequests(request: Request): Request[] {
    return this.requests.filter(req => {
      if (req.id === request.id || req.status === "rejected") return false;
      
      const reqStart = new Date(req.startDate);
      const reqEnd = new Date(req.endDate);
      const checkStart = new Date(request.startDate);
      const checkEnd = new Date(request.endDate);
      
      return (reqStart <= checkEnd && reqEnd >= checkStart);
    });
  }
}
