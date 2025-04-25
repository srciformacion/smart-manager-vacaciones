
import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { SmartAssistantPanel } from "@/components/hr/smart-assistant-panel";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useProfileAuth } from "@/hooks/profile/useProfileAuth";
import { useNavigate } from "react-router-dom";

export default function SmartAssistantPage() {
  const { user, fetchAuthUser } = useProfileAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Temporary mock data (this should be replaced with real data fetching)
  const requests = [];
  const workers = [];
  const balances = {};

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const authUser = await fetchAuthUser();
      if (!authUser) {
        navigate('/auth');
        return;
      }
      
      const role = authUser.user_metadata?.role || localStorage.getItem('userRole');
      if (role !== 'hr') {
        navigate('/dashboard');
      }
      
      // Simulate data refresh
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout user={user}>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Asistente inteligente</h1>
            <p className="text-muted-foreground mt-2">
              Análisis y recomendaciones para la gestión eficiente del personal
            </p>
          </div>
          
          <Button onClick={handleRefresh} disabled={isLoading}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            {isLoading ? "Actualizando..." : "Actualizar datos"}
          </Button>
        </div>

        <SmartAssistantPanel
          overlaps={[]}
          groupCrowding={[]}
          permissionAccumulation={[]}
          vacationLimit={[]}
        />
      </div>
    </MainLayout>
  );
}
