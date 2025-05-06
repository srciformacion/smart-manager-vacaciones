
import { Request, RequestStatus } from "@/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, Download, Eye, MoreHorizontal, X } from "lucide-react";

export interface RequestTableActionsProps {
  request: Request;
  isHRView?: boolean;
  onViewDetails: (request: Request) => void;
  onStatusChange?: (request: Request, newStatus: RequestStatus) => void;
  onDownloadAttachment?: (request: Request) => void;
}

export function RequestTableActions({
  request,
  isHRView = false,
  onViewDetails,
  onStatusChange,
  onDownloadAttachment,
}: RequestTableActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <span className="sr-only">Abrir menú</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onViewDetails(request)}>
          <Eye className="mr-2 h-4 w-4" />
          <span>Ver detalles</span>
        </DropdownMenuItem>
        
        {request.attachmentUrl && onDownloadAttachment && (
          <DropdownMenuItem onClick={() => onDownloadAttachment(request)}>
            <Download className="mr-2 h-4 w-4" />
            <span>Descargar adjunto</span>
          </DropdownMenuItem>
        )}
        
        {isHRView && onStatusChange && request.status === "pending" && (
          <>
            <DropdownMenuItem 
              onClick={() => onStatusChange(request, "approved")}
            >
              <Check className="mr-2 h-4 w-4 text-green-500" />
              <span>Aprobar</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => onStatusChange(request, "rejected")}
            >
              <X className="mr-2 h-4 w-4 text-red-500" />
              <span>Rechazar</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
