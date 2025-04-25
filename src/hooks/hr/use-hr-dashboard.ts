
import { useState } from "react";
import { Request, User, Balance } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { SmartAssistant } from "@/utils/hr/smart-assistant";
import NocoDBAPI from "@/utils/nocodbApi";

export function useHRDashboard(
  initialRequests: Request[],
  initialWorkers: User[],
  initialBalances: Record<string, Balance>
) {
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [workers] = useState<User[]>(initialWorkers);
  const [balances] = useState<Record<string, Balance>>(initialBalances);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<User | null>(null);
  const { toast } = useToast();

  const smartAnalysis = SmartAssistant.analyzeAll(
    requests,
    workers,
    Object.values(balances)
  );

  const handleStatusChange = async (request: Request, newStatus: Request["status"]) => {
    try {
      // En una implementación real, actualizaríamos en NocoDB
      // await NocoDBAPI.updateRequestStatus(request.id, newStatus);
      
      const updatedRequests = requests.map(req => 
        req.id === request.id 
          ? { ...req, status: newStatus, updatedAt: new Date() } 
          : req
      );
      
      setRequests(updatedRequests);
      setSelectedRequest(null);
      
      toast({
        title: "Solicitud actualizada",
        description: `Solicitud ${request.id} actualizada a estado: ${newStatus}`,
      });
      
    } catch (error) {
      console.error("Error al actualizar solicitud:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar la solicitud",
      });
    }
  };

  const handleViewRequestDetails = (request: Request) => {
    const worker = workers.find(w => w.id === request.userId) || null;
    setSelectedWorker(worker);
    setSelectedRequest(request);
  };

  const handleDownloadAttachment = () => {
    if (selectedRequest?.attachmentUrl) {
      console.log("Descargando adjunto:", selectedRequest.attachmentUrl);
      toast({
        title: "Descargando archivo",
        description: "Descargando archivo justificante...",
      });
    }
  };

  // Calculate stats
  const totalWorkers = workers.length;
  const pendingRequests = requests.filter((req) => req.status === "pending").length;
  const approvedRequests = requests.filter((req) => req.status === "approved").length;
  const alertsCount = 
    smartAnalysis.overlaps.length + 
    smartAnalysis.groupCrowding.length + 
    smartAnalysis.permissionAccumulation.length + 
    smartAnalysis.vacationLimit.length;

  const now = new Date();
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weeklyRequests = requests.filter(
    (req) => new Date(req.createdAt) >= oneWeekAgo
  ).length;

  return {
    requests,
    workers,
    selectedRequest,
    selectedWorker,
    smartAnalysis,
    stats: {
      totalWorkers,
      pendingRequests,
      approvedRequests,
      alertsCount,
      weeklyRequests,
    },
    handleStatusChange,
    handleViewRequestDetails,
    handleDownloadAttachment,
    closeRequestDetails: () => {
      setSelectedRequest(null);
      setSelectedWorker(null);
    },
  };
}
