
import { useState } from "react";
import { Request, User } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/ui/status-badge";
import { Download, Calendar, Clock, FileText, User as UserIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DetailedRequestViewProps {
  request: Request;
  user?: User | null;
  onStatusChange: (request: Request, newStatus: Request["status"], observations?: string) => void;
  onDownloadAttachment?: (request: Request) => void;
  onClose: () => void;
}

export function DetailedRequestView({
  request,
  user,
  onStatusChange,
  onDownloadAttachment,
  onClose,
}: DetailedRequestViewProps) {
  const [observations, setObservations] = useState(request.observations || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState<{type: "success" | "error", message: string} | null>(null);
  
  // Calcular la duración en días
  const durationInDays = Math.floor(
    (new Date(request.endDate).getTime() - new Date(request.startDate).getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  const handleStatusChange = async (newStatus: Request["status"]) => {
    try {
      setIsSubmitting(true);
      setActionMessage(null);
      await onStatusChange(request, newStatus, observations);
      setActionMessage({
        type: "success",
        message: `La solicitud ha sido ${newStatus === "approved" ? "aprobada" : newStatus === "rejected" ? "rechazada" : "actualizada"} correctamente.`
      });
    } catch (error) {
      setActionMessage({
        type: "error",
        message: "Ha ocurrido un error al procesar la solicitud."
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para obtener el título según el tipo de solicitud
  const getRequestTypeTitle = () => {
    switch (request.type) {
      case "vacation":
        return "Solicitud de vacaciones";
      case "personalDay":
        return "Solicitud de asuntos propios";
      case "leave":
        return "Solicitud de permiso justificado";
      case "shiftChange":
        return "Solicitud de cambio de turno";
      default:
        return "Solicitud";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">{getRequestTypeTitle()}</CardTitle>
        <div className="flex items-center justify-between mt-2">
          <div className="text-sm text-muted-foreground">
            ID: {request.id} • Creada: {format(new Date(request.createdAt), "PPP", { locale: es })}
          </div>
          <StatusBadge status={request.status} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {actionMessage && (
          <Alert variant={actionMessage.type === "success" ? "default" : "destructive"}>
            <AlertTitle>{actionMessage.type === "success" ? "Éxito" : "Error"}</AlertTitle>
            <AlertDescription>{actionMessage.message}</AlertDescription>
          </Alert>
        )}
        
        {/* Información del usuario */}
        {user && (
          <div className="rounded-lg border border-border p-4">
            <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
              <UserIcon className="h-4 w-4" />
              Datos del trabajador
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Nombre:</div>
              <div>{user.name}</div>
              <div className="text-muted-foreground">Email:</div>
              <div>{user.email}</div>
              <div className="text-muted-foreground">Departamento:</div>
              <div>{user.department}</div>
              <div className="text-muted-foreground">Turno:</div>
              <div>{user.shift}</div>
              <div className="text-muted-foreground">Grupo:</div>
              <div>{user.workGroup}</div>
              <div className="text-muted-foreground">Antigüedad:</div>
              <div>{user.seniority} años</div>
            </div>
          </div>
        )}

        {/* Detalles de fechas */}
        <div className="rounded-lg border border-border p-4">
          <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4" />
            Periodo solicitado
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">Fecha inicio:</div>
            <div>{format(new Date(request.startDate), "PPP", { locale: es })}</div>
            <div className="text-muted-foreground">Fecha fin:</div>
            <div>{format(new Date(request.endDate), "PPP", { locale: es })}</div>
            <div className="text-muted-foreground">Duración:</div>
            <div>{durationInDays} días</div>
            {request.startTime && (
              <>
                <div className="text-muted-foreground">Hora inicio:</div>
                <div>{request.startTime}</div>
              </>
            )}
            {request.endTime && (
              <>
                <div className="text-muted-foreground">Hora fin:</div>
                <div>{request.endTime}</div>
              </>
            )}
            {request.replacementUserId && (
              <>
                <div className="text-muted-foreground">Sustituto:</div>
                <div>ID: {request.replacementUserId}</div>
              </>
            )}
          </div>
        </div>

        {/* Motivo */}
        {request.reason && (
          <div className="rounded-lg border border-border p-4">
            <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4" />
              Motivo de la solicitud
            </h3>
            <p className="text-sm">{request.reason}</p>
          </div>
        )}

        {/* Justificante (si existe) */}
        {request.attachmentUrl && (
          <div className="rounded-lg border border-border p-4">
            <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4" />
              Justificante
            </h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onDownloadAttachment?.(request)}
              className="mt-2"
            >
              <Download className="h-4 w-4 mr-2" /> Descargar justificante
            </Button>
          </div>
        )}

        {/* Estado actual */}
        <div className="rounded-lg border border-border p-4">
          <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4" />
            Estado actual
          </h3>
          <div className="flex items-center">
            <StatusBadge status={request.status} className="text-sm" />
            <span className="text-sm ml-2 text-muted-foreground">
              Última actualización: {format(new Date(request.updatedAt), "PPP", { locale: es })}
            </span>
          </div>
        </div>

        {/* Formulario de observaciones */}
        <div className="rounded-lg border border-border p-4">
          <h3 className="text-sm font-medium mb-2">Observaciones</h3>
          <Textarea
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder="Añada observaciones o motivos para la aprobación/rechazo..."
            className="min-h-[100px]"
          />
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2 justify-end border-t p-4">
        {/* Botones de acción para RRHH */}
        {request.status === "pending" && (
          <>
            <Button 
              variant="outline" 
              className="bg-success/10 text-success hover:bg-success/20"
              onClick={() => handleStatusChange("approved")}
              disabled={isSubmitting}
            >
              Aprobar solicitud
            </Button>
            <Button 
              variant="outline" 
              className="bg-warning/10 text-warning hover:bg-warning/20" 
              onClick={() => handleStatusChange("moreInfo")}
              disabled={isSubmitting}
            >
              Solicitar más información
            </Button>
            <Button 
              variant="outline" 
              className="bg-danger/10 text-danger hover:bg-danger/20" 
              onClick={() => handleStatusChange("rejected")}
              disabled={isSubmitting}
            >
              Rechazar solicitud
            </Button>
          </>
        )}
        <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
          Volver
        </Button>
      </CardFooter>
    </Card>
  );
}
