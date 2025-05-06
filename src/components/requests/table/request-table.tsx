
import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RequestTableActions } from "./request-table-actions";
import { Request, RequestStatus } from "@/types";
import { StatusBadge } from "./status-badge";
import { Badge } from "@/components/ui/badge";
import { TableCell } from "@/components/ui/table"; // Added missing import

interface RequestTableProps {
  requests: Request[];
  isHRView?: boolean;
  isLoading?: boolean;
  onViewDetails: (request: Request) => void;
  onStatusChange?: (request: Request, newStatus: RequestStatus) => void;
}

export function RequestTable({
  requests,
  isHRView = false,
  isLoading = false,
  onViewDetails,
  onStatusChange,
}: RequestTableProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "d 'de' MMMM 'de' yyyy", { locale: es });
    } catch (error) {
      return "Fecha inválida";
    }
  };

  const getRequestTypeName = (type: string): string => {
    switch (type) {
      case 'vacation':
        return 'Vacaciones';
      case 'personalDay':
        return 'Día personal';
      case 'leave':
        return 'Permiso';
      case 'shiftChange':
        return 'Cambio de turno';
      default:
        return type;
    }
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo</TableHead>
            <TableHead>Fecha inicio</TableHead>
            <TableHead>Fecha fin</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No hay solicitudes para mostrar
              </TableCell>
            </TableRow>
          ) : (
            requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <Badge variant="outline">
                    {getRequestTypeName(request.type)}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(request.startDate)}</TableCell>
                <TableCell>{formatDate(request.endDate)}</TableCell>
                <TableCell>
                  <StatusBadge status={request.status} />
                </TableCell>
                <TableCell className="text-right">
                  <RequestTableActions
                    request={request}
                    isHRView={isHRView}
                    onViewDetails={onViewDetails}
                    onStatusChange={onStatusChange}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
