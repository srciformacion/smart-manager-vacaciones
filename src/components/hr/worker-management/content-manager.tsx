
import React from "react";
import { User, Balance } from "@/types";
import { WorkerForm } from "@/components/hr/worker-form/worker-form";
import { BalanceForm } from "@/components/hr/balance-form";
import { WorkerList } from "@/components/hr/worker-list";
import { SuccessMessage } from "./success-message";
import { PageState } from "./use-worker-management";

interface ContentManagerProps {
  pageState: PageState;
  workers: User[];
  balances: Record<string, Balance>;
  selectedWorker: User | null;
  isSubmitting: boolean;
  successMessage: string | null;
  onAddWorker: () => void;
  onEditWorker: (worker: User) => void;
  onViewDetails: (worker: User) => void;
  onAdjustBalance: (worker: User) => void;
  onWorkerSubmit: (data: any) => Promise<void>;
  onBalanceSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export function ContentManager({
  pageState,
  workers,
  balances,
  selectedWorker,
  isSubmitting,
  successMessage,
  onAddWorker,
  onEditWorker,
  onViewDetails,
  onAdjustBalance,
  onWorkerSubmit,
  onBalanceSubmit,
  onCancel
}: ContentManagerProps) {
  switch (pageState) {
    case "add-worker":
      return (
        <WorkerForm
          onSubmit={onWorkerSubmit}
          onCancel={onCancel}
          isSubmitting={isSubmitting}
        />
      );
      
    case "edit-worker":
      return selectedWorker ? (
        <WorkerForm
          worker={selectedWorker}
          onSubmit={onWorkerSubmit}
          onCancel={onCancel}
          isSubmitting={isSubmitting}
        />
      ) : null;
      
    case "adjust-balance":
      return selectedWorker ? (
        <BalanceForm
          worker={selectedWorker}
          balance={balances[selectedWorker.id]}
          onSubmit={onBalanceSubmit}
          onCancel={onCancel}
          isSubmitting={isSubmitting}
        />
      ) : null;
      
    case "success":
      return <SuccessMessage message={successMessage} />;
      
    case "list":
    default:
      return (
        <WorkerList
          workers={workers}
          balances={balances}
          onAddWorker={onAddWorker}
          onEditWorker={onEditWorker}
          onViewDetails={onViewDetails}
          onAdjustBalance={onAdjustBalance}
        />
      );
  }
}
