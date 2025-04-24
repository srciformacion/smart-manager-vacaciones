
import React from "react";
import { User, Balance } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Edit, User as UserIcon } from "lucide-react";

interface WorkersTableProps {
  workers: User[];
  balances?: Record<string, Balance>;
  onEditWorker: (worker: User) => void;
  onViewDetails: (worker: User) => void;
  onAdjustBalance: (worker: User) => void;
}

export function WorkersTable({
  workers,
  balances,
  onEditWorker,
  onViewDetails,
  onAdjustBalance,
}: WorkersTableProps) {
  const getWorkerBalance = (workerId: string) => {
    if (!balances || !balances[workerId]) return { vacationDays: 0, personalDays: 0, leaveDays: 0 };
    return balances[workerId];
  };

  return (
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
          {workers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No se encontraron trabajadores con los filtros aplicados
              </TableCell>
            </TableRow>
          ) : (
            workers.map((worker) => {
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
  );
}
