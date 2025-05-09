
import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { User } from "@/types";
import { exampleUser, exampleWorkers } from "@/data/example-users";
import { 
  PageHeader, 
  ContentManager,
  useWorkerManagement
} from "@/components/hr/worker-management";

// Create example balances for all workers
const generateExampleBalances = () => {
  const balances = {};
  
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

export default function WorkersManagementPage() {
  const [user] = useState<User | null>(exampleUser);
  
  const {
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
  } = useWorkerManagement(exampleWorkers, exampleBalances);

  return (
    <MainLayout user={user}>
      <div className="space-y-8">
        <PageHeader 
          title="Gestión de trabajadores" 
          description="Administre los datos de los trabajadores, sus grupos y saldos disponibles" 
        />

        <ContentManager
          pageState={pageState}
          workers={workers}
          balances={balances}
          selectedWorker={selectedWorker}
          isSubmitting={isSubmitting}
          successMessage={successMessage}
          onAddWorker={handleAddWorker}
          onEditWorker={handleEditWorker}
          onViewDetails={handleViewDetails}
          onAdjustBalance={handleAdjustBalance}
          onWorkerSubmit={handleWorkerFormSubmit}
          onBalanceSubmit={handleBalanceFormSubmit}
          onCancel={() => setPageState("list")}
        />
      </div>
    </MainLayout>
  );
}
