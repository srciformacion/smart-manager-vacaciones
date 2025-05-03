
import { AISimulationPanel } from "@/components/hr/ai-assistant/ai-simulation-panel";
import { Request, User } from "@/types";
import { AIService } from "@/utils/ai/AIService";

interface SimulationTabProps {
  requests: Request[];
  workers: User[];
  aiService: AIService;
}

export function SimulationTab({
  requests,
  workers,
  aiService
}: SimulationTabProps) {
  return (
    <div className="m-0 p-6">
      <AISimulationPanel 
        requests={requests} 
        workers={workers} 
        aiService={aiService}
      />
    </div>
  );
}
