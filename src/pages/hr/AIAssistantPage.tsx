
import { MainLayout } from "@/components/layout/main-layout";
import { EnhancedAIPanel } from "@/components/hr/ai-assistant/enhanced-ai-panel";
import { exampleUser } from "@/data/example-users";
import { useProfileAuth } from "@/hooks/profile/useProfileAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AIAssistantPage() {
  const { user, fetchAuthUser } = useProfileAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const authUser = await fetchAuthUser();
      if (!authUser) {
        navigate('/auth');
        return;
      }
      
      // Check if user is HR
      const role = authUser.user_metadata?.role || localStorage.getItem('userRole');
      if (role !== 'hr') {
        navigate('/dashboard');
      }
    };
    
    checkAuth();
  }, [fetchAuthUser, navigate]);

  return (
    <MainLayout user={user || exampleUser}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Asistente de IA</h1>
          <p className="text-muted-foreground mt-2">
            Análisis inteligente, recomendaciones personalizadas y chat interactivo para optimizar la gestión de RRHH
          </p>
        </div>

        <EnhancedAIPanel />
      </div>
    </MainLayout>
  );
}
