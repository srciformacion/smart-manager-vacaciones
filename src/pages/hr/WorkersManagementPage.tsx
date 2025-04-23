
import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { WorkerList } from "@/components/hr/worker-list";
import { WorkerForm } from "@/components/hr/worker-form";
import { BalanceForm } from "@/components/hr/balance-form";
import { User, Balance, ShiftType, WorkdayType, Department, WorkGroup, UserRole } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Datos de ejemplo para demostración
const exampleUser: User = {
  id: "rrhh-user",
  name: "Carlos Rodríguez", 
  email: "rrhh@email.com",
  role: "hr",
  shift: "Programado",
  workGroup: "Grupo Programado",
  workday: "Completa",
  department: "Recursos Humanos",
  seniority: 5,
};

const exampleWorkers: User[] = [
  {
    id: "1",
    name: "Ana Martínez",
    email: "ana.martinez@empresa.com",
    role: "worker",
    shift: "Programado",
    workGroup: "Grupo Programado",
    workday: "Completa",
    department: "Atención al cliente",
    seniority: 3,
  },
  {
    id: "2",
    name: "Luis García",
    email: "luis.garcia@empresa.com",
    role: "worker",
    shift: "Urgente 24h",
    workGroup: "Urgente 24h",
    workday: "Completa",
    department: "Operaciones",
    seniority: 2,
  },
  {
    id: "3",
    name: "Elena Sánchez",
    email: "elena.sanchez@empresa.com",
    role: "worker",
    shift: "Localizado",
    workGroup: "Grupo Localizado",
    workday: "Completa",
    department: "Administración",
    seniority: 5,
  },
  {
    id: "4",
    name: "Francisco José Fernández López",
    email: "fjflopez@larioja.org",
    role: "worker",
    shift: "Programado",
    workGroup: "Grupo Programado",
    workday: "Completa",
    department: "Recursos Humanos",
    seniority: 7,
  },
];

const exampleBalances: Record<string, Balance> = {
  "1": {
    id: "balance-1",
    userId: "1",
    vacationDays: 22,
    personalDays: 6,
    leaveDays: 3,
    year: 2023,
  },
  "2": {
    id: "balance-2",
    userId: "2",
    vacationDays: 15,
    personalDays: 4,
    leaveDays: 3,
    year: 2023,
  },
  "3": {
    id: "balance-3",
    userId: "3",
    vacationDays: 25,
    personalDays: 6,
    leaveDays: 3,
    year: 2023,
  },
  "4": {
    id: "balance-4",
    userId: "4",
    vacationDays: 30,
    personalDays: 5,
    leaveDays: 3,
    year: 2023,
  },
};

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
