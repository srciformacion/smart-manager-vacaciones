
import { useState, useEffect } from "react";
import { Request, RequestStatus, User } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Download, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { createTableSubscription } from "@/utils/realtime-utils";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface RequestListRealtimeProps {
  users?: User[];
  isHRView?: boolean;
  onViewDetails: (request: Request) => void;
  onStatusChange: (request: Request, newStatus: RequestStatus) => void;
  onDownloadAttachment: (request: Request) => void;
}

export function RequestListRealtime({
  users = [],
  isHRView = false,
  onViewDetails,
  onStatusChange,
  onDownloadAttachment
}: RequestListRealtimeProps) {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar solicitudes y configurar suscripción en tiempo real
  useEffect(() => {
    const loadRequests = async () => {
      try {
        const { data, error } = await supabase
          .from('requests')
          .select('*')
          .order('updatedat', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          // Convertir los datos al formato Request
          const mappedRequests: Request[] = data.map(req => ({
            id: req.id,
            userId: req.userid,
            type: req.type as any,
            startDate: new Date(req.startdate),
            endDate: new Date(req.enddate),
            status: req.status as RequestStatus,
            reason: req.reason || '',
            observations: req.notes || '',
            createdAt: new Date(req.createdat),
            updatedAt: new Date(req.updatedat),
            attachmentUrl: req.attachmenturl
          }));
          
          setRequests(mappedRequests);
        }
      } catch (error) {
        console.error("Error loading requests:", error);
      } finally {
        setLoading(false);
      }
    };
    
    // Cargar las solicitudes inicialmente
    loadRequests();
    
    // Configurar suscripción para escuchar cambios
    const channel = supabase.channel('table-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'requests'
        }, 
        (payload) => {
          console.log("Requests realtime update:", payload);
          
          // Dependiendo del tipo de evento, actualizar el estado local
          if (payload.eventType === 'INSERT') {
            const newRequest = transformRequestData(payload.new);
            setRequests(prev => [newRequest, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedRequest = transformRequestData(payload.new);
            setRequests(prev => prev.map(req => 
              req.id === updatedRequest.id ? updatedRequest : req
            ));
          } else if (payload.eventType === 'DELETE') {
            setRequests(prev => prev.filter(req => req.id !== payload.old.id));
          }
        }
      )
      .subscribe();
    
    // Limpiar suscripción al desmontar
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);
  
  // Función para transformar datos de Supabase al formato Request
  const transformRequestData = (data: any): Request => ({
    id: data.id,
    userId: data.userid,
    type: data.type as any, 
    startDate: new Date(data.startdate),
    endDate: new Date(data.enddate),
    status: data.status as RequestStatus,
    reason: data.reason || '',
    observations: data.notes || '',
    createdAt: new Date(data.createdat),
    updatedAt: new Date(data.updatedat),
    attachmentUrl: data.attachmenturl
  });

  // Función para obtener el nombre del usuario por ID
  const getUserName = (userId: string): string => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : `Usuario ${userId.slice(0, 5)}...`;
  };

  // Función para obtener el título del tipo de solicitud
  const getRequestTypeName = (type: string): string => {
    switch (type) {
      case 'vacation': return "Vacaciones";
      case 'personalDay': return "Asuntos propios";
      case 'leave': return "Permiso";
      case 'shiftChange': return "Cambio de turno";
      case 'correction': return "Corrección de turno";
      default: return type;
    }
  };

  // Función para obtener el color del badge según el estado
  const getStatusBadgeVariant = (status: RequestStatus): string => {
    switch (status) {
      case 'approved': return "bg-green-100 text-green-800 hover:bg-green-200";
      case 'rejected': return "bg-red-100 text-red-800 hover:bg-red-200";
      case 'pending': return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case 'moreInfo': return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  // Función para obtener el texto del estado
  const getStatusText = (status: RequestStatus): string => {
    switch (status) {
      case 'approved': return "Aprobada";
      case 'rejected': return "Rechazada";
      case 'pending': return "Pendiente";
      case 'moreInfo': return "Más información";
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-48" />
                <div className="flex space-x-2 mt-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No hay solicitudes disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id} className="p-4 overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                {isHRView && (
                  <span className="font-medium mr-2">{getUserName(request.userId)}</span>
                )}
                <span>{format(request.createdAt, 'd MMM yyyy', { locale: es })}</span>
              </div>
              
              <h3 className="text-lg font-medium">{getRequestTypeName(request.type)}</h3>
              
              <div className="flex flex-wrap gap-2 text-sm">
                <div className="flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  <span>{format(request.startDate, 'd MMM', { locale: es })}</span>
                  {request.startDate.getTime() !== request.endDate.getTime() && (
                    <>
                      <span className="mx-1">-</span>
                      <span>{format(request.endDate, 'd MMM', { locale: es })}</span>
                    </>
                  )}
                </div>
                
                {request.reason && (
                  <div className="flex items-center">
                    <FileText className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                    <span className="truncate max-w-xs">{request.reason}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge className={`${getStatusBadgeVariant(request.status)}`}>
                {getStatusText(request.status)}
              </Badge>
              
              <div className="flex space-x-1">
                {request.attachmentUrl && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onDownloadAttachment(request)}
                    title="Descargar adjunto"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
                
                <Button 
                  variant="outline"
                  onClick={() => onViewDetails(request)} 
                  className="text-xs h-8"
                >
                  Ver detalles
                </Button>
                
                {isHRView && request.status === 'pending' && (
                  <>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => onStatusChange(request, 'approved')}
                      title="Aprobar"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => onStatusChange(request, 'rejected')}
                      title="Rechazar"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      onClick={() => onStatusChange(request, 'moreInfo')}
                      title="Solicitar más información"
                    >
                      <AlertCircle className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
