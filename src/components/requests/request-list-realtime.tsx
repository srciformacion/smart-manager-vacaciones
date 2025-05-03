
import { useState, useEffect } from "react";
import { Request, User, RequestStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Eye, Download, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useRealtimeData } from "@/hooks/use-realtime-data";
import { toast } from "sonner";

interface RequestListRealtimeProps {
  userId?: string; // Para filtrar por usuario específico (vista de trabajador)
  isHRView?: boolean; // Para mostrar información adicional en la vista de RRHH
  users: User[];
  onViewDetails: (request: Request) => void;
  onStatusChange?: (request: Request, newStatus: RequestStatus) => void;
  onDownloadAttachment?: (request: Request) => void;
}

export function RequestListRealtime({
  userId,
  isHRView = false,
  users,
  onViewDetails,
  onStatusChange,
  onDownloadAttachment,
}: RequestListRealtimeProps) {
  // Configuración de la suscripción
  const subscription = userId 
    ? { tableName: 'requests', filter: `userid=eq.${userId}` }
    : { tableName: 'requests' };

  // Usar el hook de tiempo real
  const {
    data: requests,
    loading,
    error,
    refresh
  } = useRealtimeData<Request>(subscription);

  // Efectos de notificación para el trabajador
  useEffect(() => {
    if (userId && requests.length > 0) {
      // Buscar solicitudes que acaban de cambiar de estado
      const newlyApproved = requests.find(req => req.status === 'approved' && req.updatedat && 
        new Date(req.updatedat).getTime() > Date.now() - 10000); // En los últimos 10 segundos
      
      if (newlyApproved) {
        toast.success("¡Tu solicitud ha sido aprobada!");
      }

      const newlyRejected = requests.find(req => req.status === 'rejected' && req.updatedat && 
        new Date(req.updatedat).getTime() > Date.now() - 10000);
      
      if (newlyRejected) {
        toast.error("Tu solicitud ha sido rechazada. Revisa los detalles.");
      }
    }
  }, [requests, userId]);

  if (loading) {
    return <div className="p-4 text-center">Cargando solicitudes...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-destructive">
        Error al cargar solicitudes: {error.message}
        <Button onClick={refresh} variant="outline" size="sm" className="ml-2">
          Reintentar
        </Button>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-lg">
        <p className="text-muted-foreground">No hay solicitudes disponibles</p>
      </div>
    );
  }

  // Ordenar solicitudes - más recientes primero
  const sortedRequests = [...requests].sort((a, b) => 
    new Date(b.createdat || 0).getTime() - new Date(a.createdat || 0).getTime()
  );

  return (
    <div className="space-y-4">
      {sortedRequests.map((request) => {
        const user = users.find((u) => u.id === request.userid);
        
        return (
          <Card key={request.id} className="p-4 relative overflow-hidden">
            {/* Indicador de estado como borde lateral */}
            <div 
              className={`absolute left-0 top-0 bottom-0 w-1.5 
                ${request.status === 'approved' 
                  ? 'bg-green-500' 
                  : request.status === 'rejected' 
                  ? 'bg-red-500' 
                  : request.status === 'moreInfo' 
                  ? 'bg-amber-500' 
                  : 'bg-blue-500'}`}
            />
            
            <div className="flex flex-col md:flex-row justify-between gap-4 pl-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={
                    request.type === 'vacation' ? 'default' :
                    request.type === 'personalDay' ? 'secondary' :
                    request.type === 'leave' ? 'destructive' : 'outline'
                  }>
                    {request.type === 'vacation' ? 'Vacaciones' :
                     request.type === 'personalDay' ? 'Día personal' :
                     request.type === 'leave' ? 'Permiso' :
                     request.type === 'shiftChange' ? 'Cambio de turno' : request.type}
                  </Badge>
                  
                  <Badge variant={
                    request.status === 'approved' ? 'success' :
                    request.status === 'rejected' ? 'destructive' :
                    request.status === 'moreInfo' ? 'warning' : 'default'
                  }>
                    {request.status === 'approved' ? 'Aprobada' :
                     request.status === 'rejected' ? 'Rechazada' :
                     request.status === 'moreInfo' ? 'Más información' : 'Pendiente'}
                  </Badge>
                </div>
                
                <p className="font-medium">
                  {isHRView && user ? `${user.name} ${user.surname || ''}` : ''}
                  {request.reason && <span className="font-normal"> - {request.reason}</span>}
                </p>
                
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Período:</span>{' '}
                  {format(new Date(request.startdate), 'PPP', { locale: es })} 
                  {' '} a {' '}
                  {format(new Date(request.enddate), 'PPP', { locale: es })}
                </p>
                
                {request.createdat && (
                  <p className="text-xs text-muted-foreground">
                    Solicitado el {format(new Date(request.createdat), 'PPP', { locale: es })}
                  </p>
                )}
              </div>
              
              <div className="flex flex-row md:flex-col gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => onViewDetails(request)}>
                  <Eye size={16} className="mr-1" /> {isHRView ? 'Ver detalles' : 'Ver solicitud'}
                </Button>
                
                {isHRView && onStatusChange && (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => onStatusChange(request, 'approved')}
                      disabled={request.status === 'approved'}
                    >
                      <CheckCircle size={16} />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => onStatusChange(request, 'rejected')}
                      disabled={request.status === 'rejected'}
                    >
                      <XCircle size={16} />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                      onClick={() => onStatusChange(request, 'moreInfo')}
                      disabled={request.status === 'moreInfo'}
                    >
                      <AlertCircle size={16} />
                    </Button>
                  </div>
                )}
                
                {request.attachmenturl && onDownloadAttachment && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onDownloadAttachment(request)}
                  >
                    <Download size={16} className="mr-1" /> Justificante
                  </Button>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
