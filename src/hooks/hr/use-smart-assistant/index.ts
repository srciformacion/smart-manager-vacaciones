
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfileAuth } from "@/hooks/profile/useProfileAuth";
import { toast } from "@/components/ui/use-toast";
import { exportToExcel, exportToPdf } from "./export-utils";
import { Request, User, Balance } from "@/types";
import { SmartAssistant } from "@/utils/hr/smart-assistant";

export function useSmartAssistant() {
  const { user, fetchAuthUser } = useProfileAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState<Request[]>([]);
  const [workers, setWorkers] = useState<User[]>([]);
  const [balances, setBalances] = useState<Record<string, Balance>>({});

  /**
   * Actualiza los datos del asistente inteligente
   */
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
      
      // Cargar datos más recientes (simulado)
      // En un entorno real, aquí se cargarían los datos actuales desde la API
      
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

  /**
   * Exporta los datos de análisis en el formato especificado
   */
  const exportData = async (format: 'pdf' | 'excel') => {
    try {
      // Obtener los datos de análisis
      const analysis = SmartAssistant.analyze(requests, workers, Object.values(balances));
      
      if (format === 'excel') {
        await exportToExcel(analysis);
      } else if (format === 'pdf') {
        await exportToPdf(analysis);
      }
      
      toast({
        title: `Exportación completada`,
        description: `Los datos han sido exportados en formato ${format.toUpperCase()} correctamente.`
      });
      
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudieron exportar los datos en formato ${format.toUpperCase()}`
      });
    }
  };

  /**
   * Inicializar los datos para el hook desde los ejemplos
   */
  const initializeWithExamples = (
    exampleRequests: Request[], 
    exampleWorkers: User[], 
    exampleBalances: Record<string, Balance>
  ) => {
    setRequests(exampleRequests);
    setWorkers(exampleWorkers);
    setBalances(exampleBalances);
  };

  return {
    user,
    isLoading,
    requests,
    workers,
    balances,
    handleRefresh,
    exportData,
    initializeWithExamples
  };
}
