
import { Request, User, WorkGroup } from "@/types";
import { AIAnalysisResult } from "./types";
import { validateDatesForWorkGroup } from "@/utils/vacation/work-group-rules";
import { analyzeStaffingConflicts } from "@/utils/vacation/staffing";

export class VacationAnalysisService {
  constructor(
    private requests: Request[],
    private workers: User[]
  ) {}

  public analyzeVacationRequests(): AIAnalysisResult[] {
    const pendingRequests = this.requests.filter(
      req => req.status === "pending" && req.type === "vacation"
    );

    return pendingRequests.map(request => {
      const worker = this.workers.find(w => w.id === request.userId);
      if (!worker) {
        return {
          requestId: request.id,
          recommendation: "review",
          explanation: "No se pudo encontrar información del trabajador.",
          severity: "medium"
        };
      }

      // Check work group rules
      const startDate = new Date(request.startDate);
      const endDate = new Date(request.endDate);
      const groupValidation = validateDatesForWorkGroup(startDate, endDate, worker.workGroup);
      
      if (!groupValidation.valid) {
        return {
          requestId: request.id,
          recommendation: "deny",
          explanation: `La solicitud no cumple con las reglas del grupo ${worker.workGroup}: ${groupValidation.message}`,
          conflictType: "group_rules",
          severity: "high"
        };
      }

      // Check overlaps
      const overlappingRequests = this.getOverlappingRequests(request);
      if (overlappingRequests.length > 0) {
        const overlapText = overlappingRequests.map(r => {
          const overlapWorker = this.workers.find(w => w.id === r.userId);
          return `${overlapWorker?.name || 'Trabajador'} (${new Date(r.startDate).toLocaleDateString()} - ${new Date(r.endDate).toLocaleDateString()})`;
        }).join(", ");
        
        return {
          requestId: request.id,
          recommendation: "review",
          explanation: `La solicitud se solapa con otras solicitudes aprobadas o pendientes: ${overlapText}`,
          conflictType: "date_overlap",
          severity: "medium"
        };
      }

      // Check staffing
      const staffingAnalysis = analyzeStaffingConflicts(
        startDate,
        endDate,
        worker.department,
        this.requests,
        this.workers
      );
      
      if (staffingAnalysis.hasConflict) {
        return {
          requestId: request.id,
          recommendation: "review",
          explanation: `${staffingAnalysis.message} Se recomienda revisar la cobertura del departamento.`,
          conflictType: "staffing",
          severity: "medium"
        };
      }

      // Check work group coverage
      const sameGroupRequests = this.getOverlappingRequestsByGroup(request, worker.workGroup);
      const sameGroupWorkers = this.workers.filter(w => w.workGroup === worker.workGroup);
      
      if (sameGroupRequests.length > sameGroupWorkers.length * 0.3) {
        return {
          requestId: request.id,
          recommendation: "review",
          explanation: `Demasiados trabajadores del grupo ${worker.workGroup} estarían de vacaciones simultáneamente (${sameGroupRequests.length} de ${sameGroupWorkers.length}).`,
          conflictType: "group_coverage",
          severity: "medium"
        };
      }

      return {
        requestId: request.id,
        recommendation: "approve",
        explanation: `La solicitud de ${worker.name} del ${startDate.toLocaleDateString()} al ${endDate.toLocaleDateString()} puede aprobarse. Tiene días disponibles y no hay conflictos detectados.`,
        severity: "low"
      };
    });
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

  private getOverlappingRequestsByGroup(request: Request, workGroup: WorkGroup): Request[] {
    const startDate = new Date(request.startDate);
    const endDate = new Date(request.endDate);
    
    return this.requests.filter(req => {
      if (req.id === request.id || req.status === "rejected") return false;
      
      const worker = this.workers.find(w => w.id === req.userId);
      if (!worker || worker.workGroup !== workGroup) return false;
      
      const reqStart = new Date(req.startDate);
      const reqEnd = new Date(req.endDate);
      
      return (reqStart <= endDate && reqEnd >= startDate);
    });
  }
}
