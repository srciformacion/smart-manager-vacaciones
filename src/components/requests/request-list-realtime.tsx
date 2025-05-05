
import { useState, useEffect } from "react";
import { Request, User, RequestStatus } from "@/types";
import { RequestTable } from "@/components/requests/table/request-table";
import { supabase } from "@/integrations/supabase/client";
import { useRealtimeData } from "@/hooks/use-realtime-data";
import { Skeleton } from "@/components/ui/skeleton";

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
  const { data: rawRequests, loading, error, refresh } = useRealtimeData<any>(
    { 
      tableName: 'requests', 
      event: '*',
      schema: 'public'
    },
    [],
    (newData) => {
      console.log("Real-time request update received:", newData);
    }
  );

  // Effect to map the raw Supabase data to the app's Request type
  useEffect(() => {
    if (rawRequests && Array.isArray(rawRequests) && rawRequests.length > 0) {
      try {
        const mappedRequests: Request[] = rawRequests.map((req: any) => ({
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
          observations: req.notes, // Map notes to observations
        }));
        
        setInternalRequests(mappedRequests);
        console.log("Mapped requests:", mappedRequests.length);
      } catch (err) {
        console.error("Error mapping request data:", err);
      }
    } else {
      // If no data or empty array, set empty requests
      setInternalRequests([]);
    }
  }, [rawRequests]);

  // Function to handle manual refresh
  const handleRefresh = () => {
    refresh();
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-destructive/50 rounded-md bg-destructive/10 text-destructive">
        <h3 className="font-medium">Error al cargar solicitudes</h3>
        <p className="text-sm mt-1">{error.message}</p>
        <button 
          onClick={handleRefresh}
          className="mt-2 text-sm px-3 py-1 bg-background border rounded-md hover:bg-muted transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // Make sure we have valid handlers even if not provided
  const safeViewDetails = onViewDetails || (() => console.log("View details not implemented"));
  const safeStatusChange = onStatusChange || (() => console.log("Status change not implemented"));
  const safeDownloadAttachment = onDownloadAttachment || (() => console.log("Download not implemented"));

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">
          {internalRequests.length} solicitudes en tiempo real
        </p>
        <button 
          onClick={handleRefresh}
          className="text-sm px-3 py-1 bg-background border rounded-md hover:bg-muted transition-colors"
        >
          Actualizar
        </button>
      </div>

      <RequestTable
        requests={internalRequests}
        users={users}
        isHRView={isHRView}
        onViewDetails={safeViewDetails}
        onStatusChange={safeStatusChange}
        onDownloadAttachment={safeDownloadAttachment}
      />
    </div>
  );
}
