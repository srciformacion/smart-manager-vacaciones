
import { Request, User } from "@/types";
import { Balance } from "@/types";
import { AIAnalysisResult, HoursCalculationResult, SimulationResult, AIQueryResponse } from "./types";
import { VacationAnalysisService } from "./vacation-analysis.service";
import { HoursCalculationService } from "./hours-calculation.service";
import { SimulationService } from "./simulation.service";
import { QueryService } from "./query.service";

export {
  AIAnalysisResult,
  HoursCalculationResult,
  SimulationResult,
  AIQueryResponse
};

export class AIService {
  private vacationAnalysisService: VacationAnalysisService;
  private hoursCalculationService: HoursCalculationService;
  private simulationService: SimulationService;
  private queryService: QueryService;

  constructor(
    requests: Request[] = [],
    workers: User[] = [],
    balances: Record<string, Balance> = {}
  ) {
    this.vacationAnalysisService = new VacationAnalysisService(requests, workers);
    this.hoursCalculationService = new HoursCalculationService(workers);
    this.simulationService = new SimulationService(requests, workers);
    this.queryService = new QueryService(requests, workers);
  }

  public analyzeVacationRequests(): AIAnalysisResult[] {
    return this.vacationAnalysisService.analyzeVacationRequests();
  }

  public calculateAnnualHours(): HoursCalculationResult[] {
    return this.hoursCalculationService.calculateAnnualHours();
  }

  public simulateApproval(requestIds: string[]): SimulationResult {
    return this.simulationService.simulateApproval(requestIds);
  }

  public processQuery(query: string): AIQueryResponse {
    return this.queryService.processQuery(query);
  }
}

// Create and export a singleton instance
export const aiService = new AIService();
