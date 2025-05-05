
import { useState, useEffect, useCallback } from "react";
import { useRealtimeData } from "@/hooks/use-realtime-data";
import { Request, User, RequestStatus } from "@/types";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, RefreshCw } from "lucide-react";

export function RealtimeRequests() {
  // Usar el hook de tiempo real para las solicitudes
  const {
    data: requests,
    loading,
    error,
    refresh
  } = useRealtimeData<Request>(
    { tableName: 'requests', event: '*' },
    []
  );

  // Estado para llevar un registro de las nuevas solicitudes
  const [newRequestsCount, setNewRequestsCount] = useState(0);
  const [unseenRequests, setUnseenRequests] = useState<string[]>([]);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [users, setUsers] = useState<User[]>([]);

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
        
        // Notificar sobre nuevas solicitudes con animación
        if (newUnseen.length === 1) {
          toast.info("Hay 1 nueva solicitud pendiente", {
            icon: <Bell className="text-blue-500 animate-bounce" />
          });
        } else if (newUnseen.length > 1) {
          toast.info(`Hay ${newUnseen.length} nuevas solicitudes pendientes`, {
            icon: <Bell className="text-blue-500 animate-bounce" />
          });
        }
      }
    }
  }, [requests]);

  // Función para marcar todas como vistas
  const markAllAsSeen = useCallback(() => {
    setNewRequestsCount(0);
    setUnseenRequests([]);
    toast.success("Todas las solicitudes han sido marcadas como vistas");
  }, []);

  // Función para refrescar manualmente
  const handleManualRefresh = useCallback(() => {
    refresh();
    setLastRefresh(new Date());
    toast.info("Actualizando datos en tiempo real...");
  }, [refresh]);

  // Handlers para operaciones en las solicitudes
  const handleViewDetails = (request: Request) => {
    console.log("Ver detalles:", request);
  };

  const handleStatusChange = (request: Request, newStatus: RequestStatus) => {
    console.log("Cambiar estado:", request, newStatus);
  };

  const handleDownloadAttachment = (request: Request) => {
    console.log("Descargar adjunto:", request);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="animate-spin text-primary h-8 w-8 border-4 border-current border-t-transparent rounded-full"></div>
        <p>Cargando solicitudes en tiempo real...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 border border-destructive/20 rounded-lg bg-destructive/5 text-center">
        <p className="text-destructive font-medium mb-2">Error al cargar solicitudes</p>
        <p className="text-sm text-destructive/80 mb-4">{error.message}</p>
        <Button onClick={refresh} variant="outline" size="sm" className="gap-2">
          <RefreshCw size={16} />
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-muted-foreground">
          {requests.length} solicitud(es) | Última actualización: {lastRefresh.toLocaleTimeString()}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleManualRefresh}
          className="gap-1"
        >
          <RefreshCw size={16} />
          Actualizar
        </Button>
      </div>

      {newRequestsCount > 0 && (
        <div className="bg-primary/10 p-3 rounded-md flex items-center justify-between animate-pulse">
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

      {requests.length > 0 ? (
        <div className="border rounded-md">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Tipo</th>
                <th className="p-2 text-left">Fecha</th>
                <th className="p-2 text-left">Estado</th>
                <th className="p-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id} className="border-t">
                  <td className="p-2">{request.id.slice(0, 8)}</td>
                  <td className="p-2">{request.type}</td>
                  <td className="p-2">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-2">
                    <Badge variant={
                      request.status === 'approved' ? 'success' :
                      request.status === 'rejected' ? 'destructive' :
                      'default'
                    }>
                      {request.status}
                    </Badge>
                  </td>
                  <td className="p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(request)}
                    >
                      Ver
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center p-8 border rounded-md bg-background">
          <p className="text-muted-foreground">No hay solicitudes en tiempo real</p>
        </div>
      )}
    </div>
  );
}
