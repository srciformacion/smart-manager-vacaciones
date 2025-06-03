
import React from "react";
import { Request, RequestStatus, User } from "@/types";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { RequestTypeBadge } from "@/components/ui/request-type-badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Download, User as UserIcon } from "lucide-react";
import { RequestTableActions } from "./request-table-actions";
import { Badge } from "@/components/ui/badge";

interface RequestTableRowProps {
  request: Request;
  isHRView: boolean;
  getUserName: (userId: string) => string;
  getUserInfo?: (userId: string) => User | undefined;
  onViewDetails: (request: Request) => void;
  onStatusChange?: (request: Request, newStatus: RequestStatus) => void;
  onDownloadAttachment?: (request: Request) => void;
  showWorkerInfo?: boolean;
}

export function RequestTableRow({
  request,
  isHRView,
  getUserName,
  getUserInfo,
  onViewDetails,
  onStatusChange,
  onDownloadAttachment,
  showWorkerInfo = false,
}: RequestTableRowProps) {
  const user = getUserInfo ? getUserInfo(request.userId) : undefined;
  
  return (
    <TableRow>
      {(isHRView || showWorkerInfo) && (
        <TableCell>
          <div className="flex items-center gap-2">
            <UserIcon className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium">{getUserName(request.userId)}</div>
              {user?.email && (
                <div className="text-xs text-muted-foreground">{user.email}</div>
              )}
            </div>
          </div>
        </TableCell>
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
      {(isHRView || showWorkerInfo) && (
        <TableCell>
          {user?.department ? (
            <Badge variant="outline" className="text-xs">
              {user.department}
            </Badge>
          ) : (
            <span className="text-muted-foreground text-sm">N/A</span>
          )}
        </TableCell>
      )}
      {(isHRView || showWorkerInfo) && (
        <TableCell>
          {request.attachmentUrl ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDownloadAttachment?.(request)}
              aria-label={`Descargar justificante de solicitud ${request.id}`}
            >
              <Download className="h-4 w-4 mr-1" aria-hidden="true" />
              Descargar
            </Button>
          ) : (
            <span className="text-muted-foreground text-sm">N/A</span>
          )}
        </TableCell>
      )}
      <TableCell>
        <RequestTableActions
          request={request}
          isHRView={isHRView || showWorkerInfo}
          onViewDetails={onViewDetails}
          onStatusChange={onStatusChange}
        />
      </TableCell>
    </TableRow>
  );
}
