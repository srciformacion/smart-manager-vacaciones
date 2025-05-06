import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { WorkerList } from "@/components/hr/worker-list";
import { WorkerForm } from "@/components/hr/worker-form/worker-form";
import { BalanceForm } from "@/components/hr/balance-form";
import { User, Balance, ShiftType, WorkdayType, Department, WorkGroup, UserRole } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { exampleUser, exampleWorkers } from "@/data/example-users";

// Create example balances for all workers
const generateExampleBalances = (): Record<string, Balance> => {
  const balances: Record<string, Balance> = {};
  
  exampleWorkers.forEach(worker => {
    balances[worker.id] = {
      id: `balance-${worker.id}`,
      userId: worker.id,
      vacationDays: Math.floor(Math.random() * 10) + 15, // Random between 15-25
      personalDays: Math.floor(Math.random() * 3) + 4, // Random between 4-6
      leaveDays: 3,
      year: 2023,
    };
  });
  
  return balances;
};

// Generate example balances for all workers
const exampleBalances = generateExampleBalances();

// Estados posibles para la interfaz
type PageState = 
  | "list" 
  | "add-worker" 
  | "edit-worker" 
  | "view-details" 
  | "adjust-balance"
  | "success";

export default function WorkersManagementPage() {
  const [user, setUser] = useState<User | null>(exampleUser);
  const [workers, setWorkers] = useState<User[]>(exampleWorkers);
  const [balances, setBalances] = useState<Record<string, Balance>>(exampleBalances);
  
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
      // if (selectedWorker) {
      //   // Actualizar trabajador existente
      //   await NocoDBAPI.updateUser(selectedWorker.id, { ...values });
      // } else {
      //   // Crear nuevo trabajador
      //   const newWorker = await NocoDBAPI.createUser({
      //     ...values,
      //     role: "worker",
      //   });
      //
      //   // Crear saldo inicial
      //   await NocoDBAPI.createBalance({
      //     userId: newWorker.id,
      //     vacationDays: 22, // Valor predeterminado
      //     personalDays: 6,  // Valor predeterminado
      //     leaveDays: 3,     // Valor predeterminado
      //     year: new Date().getFullYear(),
      //   });
      // }

      // Simular una petición
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
          id: `${Date.now()}`, // Generar un ID único
          ...values,
          role: "worker" as UserRole,
        };
        
        setWorkers([...workers, newWorker]);
        
        // Crear saldo inicial
        const newBalance: Balance = {
          id: `balance-${newWorker.id}`,
          userId: newWorker.id,
          vacationDays: 22, // Valor predeterminado
          personalDays: 6,  // Valor predeterminado
          leaveDays: 3,     // Valor predeterminado
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
      // const balanceId = balances[selectedWorker.id]?.id;
      // if (balanceId) {
      //   await NocoDBAPI.updateBalance(balanceId, {
      //     vacationDays: values.vacationDays,
      //     personalDays: values.personalDays,
      //     leaveDays: values.leaveDays,
      //   });
      //
      //   // Registrar el ajuste en historial
      //   await NocoDBAPI.createBalanceAdjustment({
      //     userId: selectedWorker.id,
      //     reason: values.reason,
      //     changes: {
      //       vacationDays: values.vacationDays - balances[selectedWorker.id].vacationDays,
      //       personalDays: values.personalDays - balances[selectedWorker.id].personalDays,
      //       leaveDays: values.leaveDays - balances[selectedWorker.id].leaveDays,
      //     },
      //     date: new Date(),
      //   });
      // }

      // Simular una petición
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

  // Renderizar la interfaz según el estado
  const renderContent = () => {
    switch (pageState) {
      case "add-worker":
        return (
          <WorkerForm
            onSubmit={handleWorkerFormSubmit}
            onCancel={() => setPageState("list")}
            isSubmitting={isSubmitting}
          />
        );
        
      case "edit-worker":
        return selectedWorker ? (
          <WorkerForm
            worker={selectedWorker}
            onSubmit={handleWorkerFormSubmit}
            onCancel={() => setPageState("list")}
            isSubmitting={isSubmitting}
          />
        ) : null;
        
      case "adjust-balance":
        return selectedWorker ? (
          <BalanceForm
            worker={selectedWorker}
            balance={balances[selectedWorker.id]}
            onSubmit={handleBalanceFormSubmit}
            onCancel={() => setPageState("list")}
            isSubmitting={isSubmitting}
          />
        ) : null;
        
      case "success":
        return (
          <Alert className="bg-success/10 border-success/30 mt-4">
            <AlertTitle>Operación completada</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        );
        
      case "list":
      default:
        return (
          <WorkerList
            workers={workers}
            balances={balances}
            onAddWorker={handleAddWorker}
            onEditWorker={handleEditWorker}
            onViewDetails={handleViewDetails}
            onAdjustBalance={handleAdjustBalance}
          />
        );
    }
  };

  return (
    <MainLayout user={user}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de trabajadores</h1>
          <p className="text-muted-foreground mt-2">
            Administre los datos de los trabajadores, sus grupos y saldos disponibles
          </p>
        </div>

        {renderContent()}
      </div>
    </MainLayout>
  );
}
