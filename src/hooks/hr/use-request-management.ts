
import { useState } from "react";
import { Request, User, RequestStatus } from "@/types";
import { toast } from "sonner";

export function useRequestManagement(initialRequests: Request[], exampleWorkers: User[]) {
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<User | null>(null);
  
  const handleViewRequestDetails = (request: Request) => {
    const worker = exampleWorkers.find(w => w.id === request.userId) || null;
    setSelectedWorker(worker);
    setSelectedRequest(request);
  };

  const handleDetailStatusChange = (request: Request, newStatus: RequestStatus, observations?: string) => {
    // En una aplicación real, actualizaríamos la solicitud en el backend aquí
    console.log("Actualizando estado de solicitud:", request.id, newStatus, observations);
    
    toast.success(`Solicitud ${request.id} cambiada a estado: ${newStatus}`);
    
    // Cerrar la vista de detalles después de procesar
    setTimeout(() => {
      setSelectedRequest(null);
      setSelectedWorker(null);
    }, 1500);
  };

  const handleDownloadAttachment = (request: Request) => {
    if (request.attachmentUrl) {
      console.log("Descargando adjunto:", request.attachmentUrl);
      toast.info("El justificante se está descargando...");
    }
  };

  return {
    selectedRequest,
    selectedWorker,
    handleViewRequestDetails,
    handleDetailStatusChange,
    handleDownloadAttachment,
    closeRequestDetails: () => {
      setSelectedRequest(null);
      setSelectedWorker(null);
    }
  };
}
