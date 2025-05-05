
import { useState } from "react";
import { RequestListRealtime } from "@/components/requests/request-list-realtime";
import { exampleRequests } from "@/data/example-requests";
import { Request, RequestStatus, User } from "@/types";
import { RequestDetails } from "@/components/requests/request-details";
import { toast } from "sonner";

// Sample users data for demonstration
const sampleUsers: User[] = [
  {
    id: "1",
    name: "Ana Martínez",
    email: "ana.martinez@empresa.com",
    role: "worker",
  },
  {
    id: "2",
    name: "Carlos López",
    email: "carlos.lopez@empresa.com",
    role: "worker",
  },
  {
    id: "3",
    name: "María García",
    email: "maria.garcia@empresa.com",
    role: "worker",
  },
];

export function RealTimeRequests() {
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  const handleViewDetails = (request: Request) => {
    setSelectedRequest(request);
  };

  const handleStatusChange = (request: Request, newStatus: RequestStatus) => {
    // In a real app, we would update the status in the database
    console.log(`Status of request ${request.id} changed to ${newStatus}`);
    toast.success(`Solicitud actualizada a: ${newStatus}`);
    setSelectedRequest(null);
  };

  const handleDownloadAttachment = (request: Request) => {
    if (request.attachmentUrl) {
      // In a real app, we would download the file
      toast.info(`Descargando justificante: ${request.attachmentUrl}`);
    } else {
      toast.error("No hay justificante para descargar");
    }
  };

  const handleCloseDetails = () => {
    setSelectedRequest(null);
  };

  if (selectedRequest) {
    return (
      <RequestDetails
        request={selectedRequest}
        onClose={handleCloseDetails}
        onStatusChange={handleStatusChange}
        onDownloadAttachment={handleDownloadAttachment}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-muted/50 p-4 rounded-md mb-4">
        <h3 className="font-medium mb-1">Solicitudes en tiempo real</h3>
        <p className="text-sm text-muted-foreground">
          Esta vista muestra las solicitudes actualizadas en tiempo real. Cualquier cambio en la base de datos
          se reflejará automáticamente aquí.
        </p>
      </div>
      
      <RequestListRealtime
        users={sampleUsers}
        isHRView={true}
        onViewDetails={handleViewDetails}
        onStatusChange={handleStatusChange}
        onDownloadAttachment={handleDownloadAttachment}
      />
    </div>
  );
}
