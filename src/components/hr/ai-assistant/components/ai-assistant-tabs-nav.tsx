
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, CheckCircle, HelpCircle } from "lucide-react";

interface AIAssistantTabsNavProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export function AIAssistantTabsNav({ activeTab, setActiveTab }: AIAssistantTabsNavProps) {
  return (
    <div className="px-6 pt-4 border-b">
      <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
        <TabsTrigger 
          value="vacation-analysis" 
          className="flex items-center gap-1"
          onClick={() => setActiveTab("vacation-analysis")}
        >
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">Análisis de Vacaciones</span>
          <span className="inline sm:hidden">Vacaciones</span>
        </TabsTrigger>
        <TabsTrigger 
          value="hours-calculation" 
          className="flex items-center gap-1"
          onClick={() => setActiveTab("hours-calculation")}
        >
          <Clock className="h-4 w-4" />
          <span className="hidden sm:inline">Cálculo de Horas</span>
          <span className="inline sm:hidden">Horas</span>
        </TabsTrigger>
        <TabsTrigger 
          value="simulation" 
          className="flex items-center gap-1"
          onClick={() => setActiveTab("simulation")}
        >
          <CheckCircle className="h-4 w-4" />
          <span>Simulador</span>
        </TabsTrigger>
        <TabsTrigger 
          value="query-assistant" 
          className="flex items-center gap-1"
          onClick={() => setActiveTab("query-assistant")}
        >
          <HelpCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Consultas</span>
          <span className="inline sm:hidden">Preguntar</span>
        </TabsTrigger>
      </TabsList>
    </div>
  );
}
