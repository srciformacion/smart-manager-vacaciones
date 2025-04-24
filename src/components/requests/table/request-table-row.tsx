
import React from "react";
import { Request, RequestStatus, User } from "@/types";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { RequestTypeBadge } from "@/components/ui/request-type-badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Download } from "lucide-react";
import { RequestTableActions } from "./request-table-actions";

interface RequestTableRowProps {
  request: Request;
  isHRView: boolean;
  getUserName: (userId: string) => string;
  onViewDetails: (request: Request) => void;
  onStatusChange?: (request: Request, newStatus: RequestStatus) => void;
  onDownloadAttachment?: (request: Request) => void;
}

export function RequestTableRow({
  request,
  isHRView,
  getUserName,
  onViewDetails,
  onStatusChange,
  onDownloadAttachment,
}: RequestTableRowProps) {
  return (
    <TableRow>
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
        <RequestTableActions
          request={request}
          isHRView={isHRView}
          onViewDetails={onViewDetails}
          onStatusChange={onStatusChange}
        />
      </TableCell>
    </TableRow>
  );
}
