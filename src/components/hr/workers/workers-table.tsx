
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types";

interface WorkersTableProps {
  workers: User[];
}

export function WorkersTable({ workers }: WorkersTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Turno</TableHead>
            <TableHead>Jornada</TableHead>
            <TableHead>Antigüedad</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workers.length > 0 ? (
            workers.map(worker => (
              <TableRow key={worker.id}>
                <TableCell className="font-medium">{worker.name}</TableCell>
                <TableCell>{worker.email}</TableCell>
                <TableCell>{worker.department}</TableCell>
                <TableCell>
                  <Badge variant={
                    worker.shift === "Urgente 24h" ? "destructive" : 
                    worker.shift === "Localizado" ? "outline" : "default"
                  }>
                    {worker.shift}
                  </Badge>
                </TableCell>
                <TableCell>{worker.workday}</TableCell>
                <TableCell>{worker.seniority} años</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No se encontraron resultados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
