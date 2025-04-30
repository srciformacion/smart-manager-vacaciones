
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfileAuth } from "@/hooks/profile/useProfileAuth";
import { toast } from "@/components/ui/use-toast";
import { exampleRequests } from "@/data/example-requests";
import { exampleWorkers } from "@/data/example-users";
import { exampleBalances } from "@/data/example-balances";
import { Request, User, Balance } from "@/types";

export function useSmartAssistant() {
  const { user, fetchAuthUser } = useProfileAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState<Request[]>(exampleRequests);
  const [workers, setWorkers] = useState<User[]>(exampleWorkers);
  const [balances, setBalances] = useState<Record<string, Balance>>(exampleBalances);

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
        return;
      }
      
      // Simulate data refresh
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // En un entorno real, aquí se cargarían los datos actuales
      // Por ahora, simplemente actualizamos el estado con los mismos datos de ejemplo
      setRequests([...exampleRequests]);
      
      toast({
        title: "Datos actualizados",
        description: "Los datos del asistente inteligente han sido actualizados"
      });
      
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron actualizar los datos"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    requests,
    workers,
    balances,
    handleRefresh,
  };
}
