
import React from "react";
import { Request, RequestStatus, User } from "@/types";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RequestTableRow } from "./request-table-row";

interface RequestTableProps {
  requests: Request[];
  users?: User[];
  isHRView?: boolean;
  onViewDetails: (request: Request) => void;
  onStatusChange?: (request: Request, newStatus: RequestStatus) => void;
  onDownloadAttachment?: (request: Request) => void;
}

export function RequestTable({
  requests,
  users,
  isHRView = false,
  onViewDetails,
  onStatusChange,
  onDownloadAttachment,
}: RequestTableProps) {
  const getUserName = (userId: string) => {
    if (!users) return userId;
    const user = users.find((u) => u.id === userId);
    return user ? user.name : userId;
  };

  return (
    <div className="overflow-x-auto">
      <Table aria-label={isHRView ? "Tabla de solicitudes de trabajadores" : "Tabla de mis solicitudes"}>
        <TableHeader>
          <TableRow>
            {isHRView && <TableHead>Trabajador</TableHead>}
            <TableHead>Tipo</TableHead>
            <TableHead>Fecha inicio</TableHead>
            <TableHead>Fecha fin</TableHead>
            <TableHead>Estado</TableHead>
            {isHRView && <TableHead>Justificante</TableHead>}
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length > 0 ? (
            requests.map((request) => (
              <RequestTableRow
                key={request.id}
                request={request}
                isHRView={isHRView}
                getUserName={getUserName}
                onViewDetails={onViewDetails}
                onStatusChange={onStatusChange}
                onDownloadAttachment={onDownloadAttachment}
              />
            ))
          ) : (
            <TableRow>
              <TableCell 
                colSpan={isHRView ? 7 : 5} 
                className="h-24 text-center"
              >
                No hay solicitudes disponibles.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
