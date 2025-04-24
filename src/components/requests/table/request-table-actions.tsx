
import React from "react";
import { Request, RequestStatus } from "@/types";
import { Button } from "@/components/ui/button";

interface RequestTableActionsProps {
  request: Request;
  isHRView: boolean;
  onViewDetails: (request: Request) => void;
  onStatusChange?: (request: Request, newStatus: RequestStatus) => void;
}

export function RequestTableActions({
  request,
  isHRView,
  onViewDetails,
  onStatusChange,
}: RequestTableActionsProps) {
  return (
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
  );
}
