
import React from "react";
import { Request, RequestStatus, User } from "@/types";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RequestTableRow } from "./request-table-row";
import { Card, CardContent } from "@/components/ui/card";
import { FileX } from "lucide-react";

interface RequestTableProps {
  requests: Request[];
  users: User[];
  isHRView: boolean;
  isLoading?: boolean;
  onViewDetails: (request: Request) => void;
  onStatusChange?: (request: Request, newStatus: RequestStatus) => void;
  onDownloadAttachment?: (request: Request) => void;
  showWorkerInfo?: boolean;
}

export function RequestTable({
  requests,
  users,
  isHRView,
  isLoading = false,
  onViewDetails,
  onStatusChange,
  onDownloadAttachment,
  showWorkerInfo = false,
}: RequestTableProps) {
  const getUserName = (userId: string): string => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : "Usuario desconocido";
  };

  const getUserInfo = (userId: string): User | undefined => {
    return users.find(u => u.id === userId);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">Cargando solicitudes...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <FileX className="h-12 w-12 text-muted-foreground opacity-20" />
            <p className="text-muted-foreground">No hay solicitudes para mostrar</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              {(isHRView || showWorkerInfo) && (
                <TableHead>Trabajador</TableHead>
              )}
              <TableHead>Tipo</TableHead>
              <TableHead>Fecha inicio</TableHead>
              <TableHead>Fecha fin</TableHead>
              <TableHead>Estado</TableHead>
              {(isHRView || showWorkerInfo) && (
                <>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Justificante</TableHead>
                </>
              )}
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <RequestTableRow
                key={request.id}
                request={request}
                isHRView={isHRView || showWorkerInfo}
                getUserName={getUserName}
                getUserInfo={getUserInfo}
                onViewDetails={onViewDetails}
                onStatusChange={onStatusChange}
                onDownloadAttachment={onDownloadAttachment}
                showWorkerInfo={showWorkerInfo}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
