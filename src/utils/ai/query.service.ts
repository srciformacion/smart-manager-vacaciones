
import { Request, User } from "@/types";
import { AIQueryResponse } from "./types";
import { HoursCalculationService } from "./hours-calculation.service";

export class QueryService {
  private hoursCalculationService: HoursCalculationService;

  constructor(
    private requests: Request[],
    private workers: User[]
  ) {
    this.hoursCalculationService = new HoursCalculationService(workers);
  }

  public processQuery(query: string): AIQueryResponse {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes("vacaciones") && lowerQuery.includes("agosto")) {
      let personName = "";
      const nameMatch = lowerQuery.match(/puede ([a-zA-Z]+) coger/);
      
      if (nameMatch && nameMatch[1]) {
        personName = nameMatch[1];
        const matchedWorker = this.workers.find(w => 
          w.name.toLowerCase().includes(personName.toLowerCase())
        );
        
        if (matchedWorker) {
          const augustRequests = this.requests.filter(req => {
            const reqDate = new Date(req.startDate);
            return reqDate.getMonth() === 7 && req.status === "approved";
          });
          
          if (augustRequests.length > 5) {
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
      const hourCalculations = this.hoursCalculationService.calculateAnnualHours();
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
    
    return {
      answer: "No tengo suficiente información para responder a esa consulta. Por favor, intente reformularla o proporcione más detalles.",
      confidence: 0.3
    };
  }
}
