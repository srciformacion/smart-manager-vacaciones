
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/hr/requests-management/header";
import { TabsContent as RequestsTabsContent } from "@/components/hr/requests-management/tabs-content";
import { RealtimeRequests } from "@/components/hr/requests-management/realtime-requests";
import { useAuth } from "@/hooks/use-auth";
import { User } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { enableRealtimeForTable, RealtimeConfig } from "@/utils/realtime-utils";
import { supabase } from "@/integrations/supabase/client";

const tabs = [
  { value: "pending", label: "Pendientes" },
  { value: "approved", label: "Aprobadas" },
  { value: "rejected", label: "Rechazadas" },
  { value: "all", label: "Todas" },
  { value: "realtime", label: "Tiempo Real" },
];

export function RequestsManagementPage() {
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [isRealtimeEnabled, setIsRealtimeEnabled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Enable realtime for requests table when the realtime tab is active
    if (activeTab === "realtime" && !isRealtimeEnabled) {
      enableRealtime();
    }

    return () => {
      // Clean up realtime subscriptions when component unmounts
      if (isRealtimeEnabled) {
        supabase.removeAllChannels();
        setIsRealtimeEnabled(false);
      }
    };
  }, [activeTab]);

  const enableRealtime = async () => {
    try {
      const realtimeConfig: RealtimeConfig = {
        table: "requests",
        event: "*"
      };
      
      const result = await enableRealtimeForTable(supabase, realtimeConfig);
      
      if (result.success) {
        setIsRealtimeEnabled(true);
        toast.success("Notificaciones en tiempo real activadas");
      } else {
        toast.error(`Error al activar notificaciones: ${result.error?.message}`);
      }
    } catch (error) {
      console.error("Error enabling realtime:", error);
      toast.error("Error al activar notificaciones en tiempo real");
    }
  };

  // Handler for date changes
  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  // Handler for search term changes
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <MainLayout user={user as unknown as User}>
      <div className="space-y-4">
        <Header
          onDateChange={handleDateChange}
          onSearchChange={handleSearchChange}
          selectedDate={selectedDate}
          searchTerm={searchTerm}
        />

        <Card>
          <CardHeader>
            <CardTitle>Solicitudes</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5">
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {tabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value}>
                  {tab.value === "realtime" ? (
                    <RealtimeRequests />
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
      </div>
    </MainLayout>
  );
}

export default RequestsManagementPage;
