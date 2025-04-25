
import { User, Request, Balance, RequestType, RequestStatus, WorkGroup } from "@/types";
import { exampleRequests } from "@/data/example-requests";
import { exampleWorkers } from "@/data/example-users";
import { exampleBalances } from "@/data/example-balances";
import { validateDatesForWorkGroup } from "@/utils/vacation/work-group-rules";
import { analyzeStaffingConflicts } from "@/utils/vacation/staffing";
import { calculateAvailableDays } from "@/utils/vacation/balance";

// Types for AI analysis
export interface AIAnalysisResult {
  requestId: string;
  recommendation: "approve" | "deny" | "review";
  explanation: string;
  conflictType?: string;
  severity: "low" | "medium" | "high";
}

export interface HoursCalculationResult {
  userId: string;
  workedHours: number;
  expectedHours: number;
  difference: number;
  adjustedDifference: number;
  explanation: string;
  status: "deficit" | "balanced" | "excess";
}

export interface SimulationResult {
  success: boolean;
  conflicts: string[];
  recommendation: string;
  affectedWorkers: string[];
  scheduleCoverage: number; // percentage
}

export interface AIQueryResponse {
  answer: string;
  relatedData?: any;
  confidence: number;
}

// Main AIService class
export class AIService {
  private requests: Request[];
  private workers: User[];
  private balances: Record<string, Balance>;

  constructor(
    requests: Request[] = exampleRequests,
    workers: User[] = exampleWorkers,
    balances: Record<string, Balance> = {}
  ) {
    this.requests = requests;
    this.workers = workers;
    this.balances = balances;
  }

  // Analyze all pending vacation requests and provide recommendations
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
      
      // Check if worker has enough vacation days
      const workerBalance = this.balances[worker.id] || { 
        vacationDays: 22, 
        personalDays: 3, 
        leaveDays: 5,
        year: new Date().getFullYear(),
        id: worker.id,
        userId: worker.id,
      };
      
      const startDate = new Date(request.startDate);
      const endDate = new Date(request.endDate);
      const requestDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (86400 * 1000)) + 1;
      
      // 1. Check available days
      if (requestDays > workerBalance.vacationDays) {
        return {
          requestId: request.id,
          recommendation: "deny",
          explanation: `${worker.name} ha solicitado ${requestDays} días, pero solo tiene ${workerBalance.vacationDays} días disponibles.`,
          conflictType: "insufficient_days",
          severity: "high"
        };
      }
      
      // 2. Check work group rules
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
      
      // 3. Check for overlaps with other approved/pending requests
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
      
      // 4. Check for department coverage
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
      
      // 5. Check if too many workers from same group are on vacation at the same time
      const sameGroupWorkers = this.workers.filter(w => w.workGroup === worker.workGroup);
      const sameGroupRequests = this.getOverlappingRequestsByGroup(request, worker.workGroup);
      
      if (sameGroupRequests.length > sameGroupWorkers.length * 0.3) { // If more than 30% of group is away
        return {
          requestId: request.id,
          recommendation: "review",
          explanation: `Demasiados trabajadores del grupo ${worker.workGroup} estarían de vacaciones simultáneamente (${sameGroupRequests.length} de ${sameGroupWorkers.length}).`,
          conflictType: "group_coverage",
          severity: "medium"
        };
      }
      
      // If all checks pass, recommend approval
      return {
        requestId: request.id,
        recommendation: "approve",
        explanation: `La solicitud de ${worker.name} del ${startDate.toLocaleDateString()} al ${endDate.toLocaleDateString()} puede aprobarse. Tiene días disponibles y no hay conflictos detectados.`,
        severity: "low"
      };
    });
  }
  
  // Calculate annual hours and adjustments for each worker
  public calculateAnnualHours(): HoursCalculationResult[] {
    return this.workers.map(worker => {
      // Base expected hours (simplified for this mock)
      let baseExpectedHours = worker.workday === "Completa" ? 1800 : 900;
      
      // Adjust based on seniority (8h less per year of service)
      const seniorityAdjustment = worker.seniority * 8;
      
      // Adjust for special conditions (mock logic)
      let specialAdjustment = 0;
      if (worker.id === "1") {
        specialAdjustment = 120; // Example: reduction for legal reasons
      }
      
      // Calculate total expected hours
      const expectedHours = baseExpectedHours - seniorityAdjustment - specialAdjustment;
      
      // Mock worked hours (in a real system this would come from time tracking)
      const workedHours = expectedHours + Math.floor(Math.random() * 100) - 50;
      
      // Calculate difference
      const difference = workedHours - expectedHours;
      
      // Adjusted difference (after applying any compensation policies)
      const adjustedDifference = difference;
      
      // Generate explanation
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
  
  // Simulate approving a set of vacation requests
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
    
    // Check for conflicts
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
      
      // Check department coverage
      const staffingAnalysis = analyzeStaffingConflicts(
        new Date(request.startDate),
        new Date(request.endDate),
        worker.department,
        this.requests,
        this.workers
      );
      
      if (staffingAnalysis.hasConflict) {
        conflicts.push(staffingAnalysis.message);
        totalCoverageImpact += 10; // Mock impact
      }
    });
    
    // Calculate simulated coverage
    const scheduleCoverage = Math.max(0, 100 - totalCoverageImpact);
    
    // Generate recommendation
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
  
  // Process natural language queries
  public processQuery(query: string): AIQueryResponse {
    // Convert query to lowercase for easier matching
    const lowerQuery = query.toLowerCase();
    
    // Basic pattern matching (in a real system this would use an LLM)
    if (lowerQuery.includes("vacaciones") && lowerQuery.includes("agosto")) {
      // Extract name if present
      let personName = "";
      const nameMatch = lowerQuery.match(/puede ([a-zA-Z]+) coger/);
      if (nameMatch && nameMatch[1]) {
        personName = nameMatch[1];
        
        // Find worker with matching name
        const matchedWorker = this.workers.find(w => 
          w.name.toLowerCase().includes(personName.toLowerCase())
        );
        
        if (matchedWorker) {
          // Check if there are already many approved vacations in August
          const augustRequests = this.requests.filter(req => {
            const reqDate = new Date(req.startDate);
            return reqDate.getMonth() === 7 && req.status === "approved"; // August is month 7
          });
          
          if (augustRequests.length > 5) { // Arbitrary threshold
            return {
              answer: `${matchedWorker.name} podría tener dificultades para coger vacaciones en agosto, ya que hay ${augustRequests.length} solicitudes aprobadas para ese mes. Se recomienda revisar la cobertura departamental antes de aprobar.`,
              relatedData: augustRequests,
              confidence: 0.8
            };
          } else {
            return {
              answer: `${matchedWorker.name} podría coger vacaciones en agosto. Actualmente hay pocas solicitudes aprobadas para ese mes y la cobertura departamental parece adecuada.`,
              relatedData: {
                worker: matchedWorker,
                existingRequests: augustRequests
              },
              confidence: 0.9
            };
          }
        }
      }
      
      return {
        answer: "Agosto es un mes con alta demanda de vacaciones. Se recomienda revisar la cobertura departamental antes de aprobar nuevas solicitudes.",
        confidence: 0.7
      };
    }
    
    if (lowerQuery.includes("exceso") && lowerQuery.includes("horas")) {
      const hourCalculations = this.calculateAnnualHours();
      const workersWithExcess = hourCalculations.filter(calc => calc.status === "excess");
      
      if (workersWithExcess.length > 0) {
        const examples = workersWithExcess.slice(0, 3).map(w => {
          const worker = this.workers.find(user => user.id === w.userId);
          return `${worker?.name} (${w.adjustedDifference} horas extra)`;
        }).join(", ");
        
        return {
          answer: `Hay ${workersWithExcess.length} trabajadores con exceso de horas este mes. Algunos ejemplos: ${examples}`,
          relatedData: workersWithExcess,
          confidence: 0.95
        };
      } else {
        return {
          answer: "No hay trabajadores con exceso significativo de horas este mes.",
          confidence: 0.9
        };
      }
    }
    
    // Default response for unrecognized queries
    return {
      answer: "No tengo suficiente información para responder a esa consulta. Por favor, intente reformularla o proporcione más detalles.",
      confidence: 0.3
    };
  }

  // Helper methods
  private getOverlappingRequests(request: Request): Request[] {
    return this.requests.filter(req => {
      if (req.id === request.id || req.status === "rejected") return false;
      
      const reqStart = new Date(req.startDate);
      const reqEnd = new Date(req.endDate);
      const checkStart = new Date(request.startDate);
      const checkEnd = new Date(request.endDate);
      
      // Check if date ranges overlap
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
      
      // Check if date ranges overlap
      return (reqStart <= endDate && reqEnd >= startDate);
    });
  }
}

// Create and export a singleton instance
export const aiService = new AIService();
