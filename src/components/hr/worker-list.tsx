
import React, { useState } from "react";
import { User, WorkGroup, ShiftType, Balance } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  UserPlus, 
  FileText, 
  Edit, 
  User as UserIcon 
} from "lucide-react";
import Image from "next/image";

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

  const getWorkerBalance = (workerId: string) => {
    if (!balances || !balances[workerId]) return { vacationDays: 0, personalDays: 0, leaveDays: 0 };
    return balances[workerId];
  };

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
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Image 
              src="/lovable-uploads/430ee6e3-abee-48b3-ad9b-9aec46685e6e.png" 
              alt="Search" 
              width={20} 
              height={20} 
              className="absolute left-2 top-2.5 text-sidebar-foreground/70" 
            />
            <Input
              placeholder="Buscar trabajador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 rounded-md border border-input bg-background text-sm"
          >
            <option value="all">Todos los departamentos</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value as WorkGroup | "all")}
            className="px-3 py-2 rounded-md border border-input bg-background text-sm"
          >
            <option value="all">Todos los grupos</option>
            {groups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>

          <select
            value={shiftFilter}
            onChange={(e) => setShiftFilter(e.target.value as ShiftType | "all")}
            className="px-3 py-2 rounded-md border border-input bg-background text-sm"
          >
            <option value="all">Todos los turnos</option>
            {shifts.map((shift) => (
              <option key={shift} value={shift}>
                {shift}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Turno</TableHead>
                <TableHead>Grupo</TableHead>
                <TableHead className="text-center">Vacaciones</TableHead>
                <TableHead className="text-center">A. Propios</TableHead>
                <TableHead className="text-center">Permisos</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No se encontraron trabajadores con los filtros aplicados
                  </TableCell>
                </TableRow>
              ) : (
                filteredWorkers.map((worker) => {
                  const balance = getWorkerBalance(worker.id);
                  return (
                    <TableRow key={worker.id}>
                      <TableCell className="font-medium">{worker.name}</TableCell>
                      <TableCell>{worker.department}</TableCell>
                      <TableCell>{worker.shift}</TableCell>
                      <TableCell>{worker.workGroup}</TableCell>
                      <TableCell className="text-center">{balance.vacationDays}</TableCell>
                      <TableCell className="text-center">{balance.personalDays}</TableCell>
                      <TableCell className="text-center">{balance.leaveDays}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onViewDetails(worker)}
                            title="Ver detalles"
                          >
                            <UserIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEditWorker(worker)}
                            title="Editar trabajador"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onAdjustBalance(worker)}
                            title="Ajustar saldos"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
