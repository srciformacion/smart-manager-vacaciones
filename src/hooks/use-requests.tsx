
import { useState } from "react";
import { Request, RequestStatus, User } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { sendEmailNotification } from "@/utils/emailService";

export const useRequests = (initialRequests: Request[], workers: User[]) => {
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const { toast } = useToast();

  const handleStatusChange = async (request: Request, newStatus: RequestStatus) => {
    try {
      const updatedRequests = requests.map(req => 
        req.id === request.id 
          ? { ...req, status: newStatus, updatedAt: new Date() } 
          : req
      );
      
      setRequests(updatedRequests);
      
      const worker = workers.find(w => w.id === request.userId);
      
      if (worker) {
        let notificationType;
        switch (newStatus) {
          case "approved":
            notificationType = "requestApproved";
            break;
          case "rejected":
            notificationType = "requestRejected";
            break;
          case "moreInfo":
            notificationType = "requestMoreInfo";
            break;
          default:
            return;
        }
        
        const updatedRequest = updatedRequests.find(r => r.id === request.id);
        if (updatedRequest) {
          sendEmailNotification(notificationType, updatedRequest, worker)
            .then(success => {
              if (success) {
                toast({
                  title: "Notificación enviada",
                  description: `Se ha enviado un email a ${worker.name} informando del cambio de estado de su solicitud.`,
                });
              }
            });
        }
      }
      
      toast({
        title: "Solicitud actualizada",
        description: `Solicitud ${request.id} actualizada a estado: ${newStatus}`,
      });
      
    } catch (error) {
      console.error("Error al actualizar solicitud:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar la solicitud. Inténtelo de nuevo.",
      });
    }
  };

  return {
    requests,
    setRequests,
    handleStatusChange,
  };
};
