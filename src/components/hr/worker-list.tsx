
import React, { useState } from "react";
import { User, WorkGroup, ShiftType, Balance } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { WorkerFilters } from "./worker-filters";
import { WorkersTable } from "./workers-table";

interface WorkerListProps {
  workers: User[];
  balances?: Record<string, Balance>;
  onAddWorker: () => void;
  onEditWorker: (worker: User) => void;
  onViewDetails: (worker: User) => void;
  onAdjustBalance: (worker: User) => void;
}

export function WorkerList({
  workers,
  balances,
  onAddWorker,
  onEditWorker,
  onViewDetails,
  onAdjustBalance,
}: WorkerListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string | "all">("all");
  const [groupFilter, setGroupFilter] = useState<WorkGroup | "all">("all");
  const [shiftFilter, setShiftFilter] = useState<ShiftType | "all">("all");

  const departments = Array.from(new Set(workers.map((w) => w.department)));
  const groups = Array.from(
    new Set(workers.map((w) => w.workGroup))
  ) as WorkGroup[];
  const shifts = Array.from(
    new Set(workers.map((w) => w.shift))
  ) as ShiftType[];

  const filteredWorkers = workers.filter((worker) => {
    const matchesSearch =
      searchTerm === "" ||
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      departmentFilter === "all" || worker.department === departmentFilter;

    const matchesGroup =
      groupFilter === "all" || worker.workGroup === groupFilter;

    const matchesShift =
      shiftFilter === "all" || worker.shift === shiftFilter;

    return matchesSearch && matchesDepartment && matchesGroup && matchesShift;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Gestión de trabajadores</CardTitle>
            <CardDescription>
              Administre los datos de los trabajadores y sus grupos vacacionales
            </CardDescription>
          </div>

          <div className="flex flex-col md:flex-row gap-2">
            <Button onClick={onAddWorker}>
              <UserPlus className="mr-2 h-4 w-4" />
              Nuevo trabajador
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <WorkerFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          departmentFilter={departmentFilter}
          onDepartmentChange={setDepartmentFilter}
          groupFilter={groupFilter}
          onGroupChange={setGroupFilter}
          shiftFilter={shiftFilter}
          onShiftChange={setShiftFilter}
          departments={departments}
          groups={groups}
          shifts={shifts}
        />

        <WorkersTable
          workers={filteredWorkers}
          balances={balances}
          onEditWorker={onEditWorker}
          onViewDetails={onViewDetails}
          onAdjustBalance={onAdjustBalance}
        />
      </CardContent>
    </Card>
  );
}
