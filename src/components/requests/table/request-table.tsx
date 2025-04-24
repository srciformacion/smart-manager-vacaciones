
import React from "react";
import { Request, RequestStatus, User } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { RequestTypeBadge } from "@/components/ui/request-type-badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Download } from "lucide-react";

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
      <Table>
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
          {requests.map((request) => (
            <TableRow key={request.id}>
              {isHRView && (
                <TableCell>{getUserName(request.userId)}</TableCell>
              )}
              <TableCell>
                <RequestTypeBadge type={request.type} />
              </TableCell>
              <TableCell>
                {format(new Date(request.startDate), "dd MMM yyyy", { locale: es })}
              </TableCell>
              <TableCell>
                {format(new Date(request.endDate), "dd MMM yyyy", { locale: es })}
              </TableCell>
              <TableCell>
                <StatusBadge status={request.status} />
              </TableCell>
              {isHRView && (
                <TableCell>
                  {request.attachmentUrl ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDownloadAttachment?.(request)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Descargar
                    </Button>
                  ) : (
                    <span className="text-muted-foreground text-sm">N/A</span>
                  )}
                </TableCell>
              )}
              <TableCell>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(request)}
                  >
                    Detalles
                  </Button>
                  
                  {isHRView && request.status === "pending" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-success/10 text-success hover:bg-success/20"
                        onClick={() => onStatusChange?.(request, "approved")}
                      >
                        Aprobar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-danger/10 text-danger hover:bg-danger/20"
                        onClick={() => onStatusChange?.(request, "rejected")}
                      >
                        Rechazar
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
