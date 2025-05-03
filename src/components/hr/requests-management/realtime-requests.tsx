
import { useState, useEffect } from "react";
import { useRealtimeData } from "@/hooks/use-realtime-data";
import { Request, User, RequestStatus } from "@/types";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { RequestListRealtime } from "@/components/requests/request-list-realtime";

interface RealtimeRequestsProps {
  users: User[];
  onViewDetails: (request: Request) => void;
  onStatusChange: (request: Request, newStatus: RequestStatus) => void;
  onDownloadAttachment: (request: Request) => void;
}

export function RealtimeRequests({
  users,
  onViewDetails,
  onStatusChange,
  onDownloadAttachment
}: RealtimeRequestsProps) {
  // Usar el hook de tiempo real para las solicitudes
  const {
    data: requests,
    loading,
    error,
  } = useRealtimeData<Request>(
    { tableName: 'requests', event: '*' },
    [],
    (newData) => {
      // Este callback se ejecuta cuando hay nuevos datos
      console.log("Nuevos datos recibidos:", newData);
    }
  );

  // Estado para llevar un registro de las nuevas solicitudes
  const [newRequestsCount, setNewRequestsCount] = useState(0);
  const [unseenRequests, setUnseenRequests] = useState<string[]>([]);

  // Efecto para detectar nuevas solicitudes
  useEffect(() => {
    if (requests.length > 0) {
      // Identificar solicitudes que no hemos visto antes
      const newUnseen = requests
        .filter(req => !unseenRequests.includes(req.id) && req.status === 'pending')
        .map(req => req.id);
      
      if (newUnseen.length > 0) {
        setNewRequestsCount(prev => prev + newUnseen.length);
        setUnseenRequests(prev => [...prev, ...newUnseen]);
        
        // Notificar sobre nuevas solicitudes
        if (newUnseen.length === 1) {
          toast.info("Hay 1 nueva solicitud pendiente");
        } else if (newUnseen.length > 1) {
          toast.info(`Hay ${newUnseen.length} nuevas solicitudes pendientes`);
        }
      }
    }
  }, [requests]);

  // Función para marcar todas como vistas
  const markAllAsSeen = () => {
    setNewRequestsCount(0);
    setUnseenRequests([]);
  };

  if (loading) {
    return <div className="flex items-center justify-center p-4">Cargando solicitudes en tiempo real...</div>;
  }

  if (error) {
    return <div className="p-4 text-destructive">Error al cargar solicitudes: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      {newRequestsCount > 0 && (
        <div className="bg-primary/10 p-3 rounded-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="animate-pulse">
              {newRequestsCount}
            </Badge>
            <span>
              {newRequestsCount === 1
                ? "Nueva solicitud pendiente"
                : `Nuevas solicitudes pendientes`}
            </span>
          </div>
          <button
            onClick={markAllAsSeen}
            className="text-sm text-primary hover:underline"
          >
            Marcar como vistas
          </button>
        </div>
      )}

      {/* Usar el componente RequestListRealtime para mostrar la lista de solicitudes */}
      <RequestListRealtime
        users={users}
        isHRView={true}
        onViewDetails={onViewDetails}
        onStatusChange={onStatusChange}
        onDownloadAttachment={onDownloadAttachment}
      />
    </div>
  );
}
