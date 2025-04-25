
import { useState } from "react";
import { Request, User, RequestStatus } from "@/types";
import { toast } from "@/components/ui/use-toast";

export function useRequestManagement(initialRequests: Request[], exampleWorkers: User[]) {
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<User | null>(null);
  
  const handleViewRequestDetails = (request: Request) => {
    const worker = exampleWorkers.find(w => w.id === request.userId) || null;
    setSelectedWorker(worker);
    setSelectedRequest(request);
  };

  const handleDetailStatusChange = (request: Request, newStatus: RequestStatus, observations?: string) => {
    // Close the detail view after processing
    setTimeout(() => {
      setSelectedRequest(null);
      setSelectedWorker(null);
    }, 1500);
  };

  const handleDownloadAttachment = (request: Request) => {
    if (request.attachmentUrl) {
      console.log("Descargando adjunto:", request.attachmentUrl);
      toast({
        title: "Descargando archivo",
        description: "El justificante se está descargando...",
      });
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
