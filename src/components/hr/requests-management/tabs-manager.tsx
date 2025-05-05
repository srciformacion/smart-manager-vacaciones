
import { useState, ReactNode } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsSelector } from "./tabs-selector";
import { TabsContent as RequestsTabsContent } from "@/components/hr/requests-management/tabs-content";
import { RealtimeTabContent } from "./realtime-tab-content";

const tabsConfig = [
  { value: "pending", label: "Pendientes" },
  { value: "approved", label: "Aprobadas" },
  { value: "rejected", label: "Rechazadas" },
  { value: "all", label: "Todas" },
  { value: "realtime", label: "Tiempo Real" },
];

interface TabsManagerProps {
  searchTerm: string;
  selectedDate: Date | undefined;
}

export function TabsManager({ searchTerm, selectedDate }: TabsManagerProps) {
  const [activeTab, setActiveTab] = useState("pending");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicitudes</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsSelector
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabs={tabsConfig}
          />

          {tabsConfig.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {tab.value === "realtime" ? (
                <RealtimeTabContent isActive={activeTab === "realtime"} />
              ) : (
                <RequestsTabsContent
                  status={tab.value}
                  searchTerm={searchTerm}
                  selectedDate={selectedDate}
                />
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
