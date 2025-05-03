
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Calendar, BarChart, Settings } from "lucide-react";

interface AIAssistantTabsNavProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export function AIAssistantTabsNav({ activeTab, setActiveTab }: AIAssistantTabsNavProps) {
  return (
    <div className="border-b">
      <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
        <TabsTrigger
          value="vacation-analysis"
          className={`rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 ${
            activeTab === "vacation-analysis" ? "border-primary" : ""
          }`}
          onClick={() => setActiveTab("vacation-analysis")}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Análisis de Vacaciones
        </TabsTrigger>
        
        <TabsTrigger
          value="hours-calculation"
          className={`rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 ${
            activeTab === "hours-calculation" ? "border-primary" : ""
          }`}
          onClick={() => setActiveTab("hours-calculation")}
        >
          <BarChart className="mr-2 h-4 w-4" />
          Cálculo de Horas
        </TabsTrigger>
        
        <TabsTrigger
          value="simulation"
          className={`rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 ${
            activeTab === "simulation" ? "border-primary" : ""
          }`}
          onClick={() => setActiveTab("simulation")}
        >
          <BarChart className="mr-2 h-4 w-4" />
          Simulación
        </TabsTrigger>
        
        <TabsTrigger
          value="query-assistant"
          className={`rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 ${
            activeTab === "query-assistant" ? "border-primary" : ""
          }`}
          onClick={() => setActiveTab("query-assistant")}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Consulta
        </TabsTrigger>
        
        <TabsTrigger
          value="ai-settings"
          className={`rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 ${
            activeTab === "ai-settings" ? "border-primary" : ""
          }`}
          onClick={() => setActiveTab("ai-settings")}
        >
          <Settings className="mr-2 h-4 w-4" />
          Configuración
        </TabsTrigger>
      </TabsList>
    </div>
  );
}
