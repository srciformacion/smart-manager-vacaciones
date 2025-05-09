
import { useState } from "react";
import { User, Balance } from "@/types";

// Estados posibles para la interfaz
export type PageState = 
  | "list" 
  | "add-worker" 
  | "edit-worker" 
  | "view-details" 
  | "adjust-balance"
  | "success";

export function useWorkerManagement(
  initialWorkers: User[],
  initialBalances: Record<string, Balance>
) {
  const [workers, setWorkers] = useState<User[]>(initialWorkers);
  const [balances, setBalances] = useState<Record<string, Balance>>(initialBalances);
  
  const [pageState, setPageState] = useState<PageState>("list");
  const [selectedWorker, setSelectedWorker] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Manejar la adición de un nuevo trabajador
  const handleAddWorker = () => {
    setSelectedWorker(null);
    setPageState("add-worker");
  };

  // Manejar la edición de un trabajador
  const handleEditWorker = (worker: User) => {
    setSelectedWorker(worker);
    setPageState("edit-worker");
  };

  // Manejar la vista de detalles de un trabajador
  const handleViewDetails = (worker: User) => {
    setSelectedWorker(worker);
    setPageState("view-details");
  };

  // Manejar el ajuste de saldo de un trabajador
  const handleAdjustBalance = (worker: User) => {
    setSelectedWorker(worker);
    setPageState("adjust-balance");
  };

  // Manejar el envío del formulario de trabajador (crear/editar)
  const handleWorkerFormSubmit = async (values: any) => {
    setIsSubmitting(true);
    
    try {
      // En una implementación real, enviaríamos a NocoDB
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (selectedWorker) {
        // Actualizar en el estado local
        const updatedWorkers = workers.map(w => 
          w.id === selectedWorker.id ? { ...selectedWorker, ...values } : w
        );
        setWorkers(updatedWorkers);
        setSuccessMessage("Trabajador actualizado correctamente");
      } else {
        // Agregar al estado local
        const newWorker = {
          id: `${Date.now()}`,
          ...values,
          role: "worker" as const,
        };
        
        setWorkers([...workers, newWorker]);
        
        // Crear saldo inicial
        const newBalance: Balance = {
          id: `balance-${newWorker.id}`,
          userId: newWorker.id,
          vacationDays: 22,
          personalDays: 6,
          leaveDays: 3,
          year: new Date().getFullYear(),
        };
        
        setBalances({
          ...balances,
          [newWorker.id]: newBalance,
        });
        
        setSuccessMessage("Trabajador creado correctamente");
      }
      
      // Mostrar mensaje de éxito y volver a la lista
      setPageState("success");
      
      // Regresar a la lista después de un tiempo
      setTimeout(() => {
        setPageState("list");
        setSuccessMessage(null);
      }, 2000);
      
    } catch (error) {
      console.error("Error al guardar trabajador:", error);
      alert("Error al guardar los datos. Inténtelo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejar el envío del formulario de ajuste de saldo
  const handleBalanceFormSubmit = async (values: any) => {
    setIsSubmitting(true);
    
    try {
      if (!selectedWorker) {
        throw new Error("No hay trabajador seleccionado");
      }
      
      // En una implementación real, enviaríamos a NocoDB
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Actualizar en el estado local
      if (balances[selectedWorker.id]) {
        const updatedBalance = {
          ...balances[selectedWorker.id],
          vacationDays: values.vacationDays,
          personalDays: values.personalDays,
          leaveDays: values.leaveDays,
        };
        
        setBalances({
          ...balances,
          [selectedWorker.id]: updatedBalance,
        });
      }
      
      // Mostrar mensaje de éxito y volver a la lista
      setSuccessMessage("Saldo actualizado correctamente");
      setPageState("success");
      
      // Regresar a la lista después de un tiempo
      setTimeout(() => {
        setPageState("list");
        setSuccessMessage(null);
      }, 2000);
      
    } catch (error) {
      console.error("Error al ajustar saldo:", error);
      alert("Error al guardar los datos. Inténtelo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    workers,
    balances,
    pageState,
    selectedWorker,
    isSubmitting,
    successMessage,
    setPageState,
    handleAddWorker,
    handleEditWorker,
    handleViewDetails,
    handleAdjustBalance,
    handleWorkerFormSubmit,
    handleBalanceFormSubmit
  };
}
