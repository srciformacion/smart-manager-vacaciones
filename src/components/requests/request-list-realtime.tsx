
import { useState, useEffect } from "react";
import { Request, User, RequestStatus } from "@/types";
import { RequestTable } from "@/components/requests/table/request-table";
import { supabase } from "@/integrations/supabase/client";
import { useRealtimeData } from "@/hooks/use-realtime-data";

interface RequestListRealtimeProps {
  users: User[];
  isHRView?: boolean;
  onViewDetails?: (request: Request) => void;
  onStatusChange?: (request: Request, newStatus: RequestStatus) => void;
  onDownloadAttachment?: (request: Request) => void;
}

export function RequestListRealtime({
  users,
  isHRView = false,
  onViewDetails,
  onStatusChange,
  onDownloadAttachment
}: RequestListRealtimeProps) {
  const [internalRequests, setInternalRequests] = useState<Request[]>([]);

  // Use the real-time data hook for requests
  const { data: requests, loading, error } = useRealtimeData<any>(
    { tableName: 'requests', event: '*' },
    [],
    (newData) => {
      console.log("Real-time request update:", newData);
    }
  );

  // Effect to map the raw Supabase data to the app's Request type
  useEffect(() => {
    if (requests && requests.length > 0) {
      const mappedRequests: Request[] = requests.map((req: any) => ({
        id: req.id,
        userId: req.userid,
        type: req.type,
        startDate: new Date(req.startdate),
        endDate: new Date(req.enddate),
        status: req.status,
        createdAt: new Date(req.createdat),
        updatedAt: new Date(req.updatedat),
        reason: req.reason,
        attachmentUrl: req.attachmenturl,
        startTime: req.starttime,
        endTime: req.endtime,
      }));
      
      setInternalRequests(mappedRequests);
    }
  }, [requests]);

  if (loading) {
    return <div className="text-center p-4">Cargando solicitudes...</div>;
  }

  if (error) {
    return <div className="text-center text-destructive p-4">Error al cargar solicitudes: {error.message}</div>;
  }

  return (
    <RequestTable
      requests={internalRequests}
      users={users}
      isHRView={isHRView}
      onViewDetails={onViewDetails}
      onStatusChange={onStatusChange}
      onDownloadAttachment={onDownloadAttachment}
    />
  );
}
