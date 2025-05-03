
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { exampleRequests } from "@/data/example-requests";
import { exampleWorkers } from "@/data/example-users";

import { AIAssistantHeader } from "./components/ai-assistant-header";
import { AIAssistantTabsNav } from "./components/ai-assistant-tabs-nav";
import { VacationAnalysisTab } from "./components/vacation-analysis-tab";
import { HoursCalculationTab } from "./components/hours-calculation-tab";
import { SimulationTab } from "./components/simulation-tab";
import { QueryAssistantTab } from "./components/query-assistant-tab";
import { AIConnectorSettings } from "./components/ai-connector-settings";
import { useAIAssistant } from "./hooks/use-ai-assistant";

export function AIAssistantPanel() {
  const {
    activeTab,
    setActiveTab,
    query,
    setQuery,
    aiResponse,
    isLoading,
    scrollAreaRef,
    aiService,
    vacationAnalysis,
    hoursCalculation,
    handleApproveRecommendation,
    handleSubmitQuery,
    handleExportData,
    handleConnectorChange
  } = useAIAssistant();
  
  return (
    <Card className="shadow-md">
      <AIAssistantHeader />
      
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <AIAssistantTabsNav activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <TabsContent value="vacation-analysis">
            <VacationAnalysisTab 
              vacationAnalysis={vacationAnalysis}
              onApproveRecommendation={handleApproveRecommendation}
              onExport={handleExportData}
            />
          </TabsContent>
          
          <TabsContent value="hours-calculation">
            <HoursCalculationTab 
              hoursCalculation={hoursCalculation}
              onExport={handleExportData}
            />
          </TabsContent>
          
          <TabsContent value="simulation">
            <SimulationTab 
              requests={exampleRequests}
              workers={exampleWorkers}
              aiService={aiService}
            />
          </TabsContent>
          
          <TabsContent value="query-assistant">
            <QueryAssistantTab 
              query={query}
              setQuery={setQuery}
              aiResponse={aiResponse}
              isLoading={isLoading}
              scrollAreaRef={scrollAreaRef}
              onSubmitQuery={handleSubmitQuery}
            />
          </TabsContent>
          
          <TabsContent value="ai-settings">
            <div className="p-6">
              <AIConnectorSettings onConnectorChange={handleConnectorChange} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
