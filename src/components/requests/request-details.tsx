
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Request, User } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { RequestTypeBadge } from "@/components/ui/request-type-badge";
import { Calendar, Clock, Download, FileText, User as UserIcon } from "lucide-react";

interface RequestDetailsProps {
  request: Request;
  user?: User;
  onClose: () => void;
  onStatusChange?: (status: Request["status"]) => void;
  onDownloadAttachment?: () => void;
  isHRView?: boolean;
}

export function RequestDetails({
  request,
  user,
  onClose,
  onStatusChange,
  onDownloadAttachment,
  isHRView = false,
}: RequestDetailsProps) {
  // Calcular la duración en días
  const durationInDays = Math.floor(
    (new Date(request.endDate).getTime() - new Date(request.startDate).getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  // Función para obtener el título según el tipo de solicitud
  const getRequestTypeTitle = () => {
    switch (request.type) {
      case "vacation":
        return "Solicitud de vacaciones";
      case "personalDay":
        return "Solicitud de asuntos propios";
      case "leave":
        return "Solicitud de permiso justificado";
      default:
        return "Solicitud";
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{getRequestTypeTitle()}</CardTitle>
            <CardDescription>
              ID: {request.id} • Creada: {format(new Date(request.createdAt), "PPP", { locale: es })}
            </CardDescription>
          </div>
          <RequestTypeBadge type={request.type} />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Información del usuario (solo para vista de RRHH) */}
        {isHRView && user && (
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
          </div>
        </div>

        {/* Motivo y observaciones */}
        {(request.reason || request.observations) && (
          <div className="rounded-lg border border-border p-4">
            <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4" />
              Información adicional
            </h3>
            {request.reason && (
              <div className="mb-4">
                <div className="text-sm text-muted-foreground mb-1">Motivo:</div>
                <p className="text-sm">{request.reason}</p>
              </div>
            )}
            {request.observations && (
              <div>
                <div className="text-sm text-muted-foreground mb-1">Observaciones:</div>
                <p className="text-sm">{request.observations}</p>
              </div>
            )}
          </div>
        )}

        {/* Justificante (si existe) */}
        {request.attachmentUrl && (
          <div className="rounded-lg border border-border p-4">
            <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4" />
              Justificante
            </h3>
            <Button variant="outline" size="sm" onClick={onDownloadAttachment}>
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
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row gap-2 justify-end">
        {/* Botones de acción para RRHH */}
        {isHRView && request.status === "pending" && (
          <>
            <Button 
              variant="outline" 
              className="bg-success/10 text-success hover:bg-success/20" 
              onClick={() => onStatusChange?.("approved")}
            >
              Aprobar solicitud
            </Button>
            <Button 
              variant="outline" 
              className="bg-warning/10 text-warning hover:bg-warning/20" 
              onClick={() => onStatusChange?.("moreInfo")}
            >
              Solicitar más información
            </Button>
            <Button 
              variant="outline" 
              className="bg-danger/10 text-danger hover:bg-danger/20" 
              onClick={() => onStatusChange?.("rejected")}
            >
              Rechazar solicitud
            </Button>
          </>
        )}
        <Button variant="ghost" onClick={onClose}>
          Cerrar
        </Button>
      </CardFooter>
    </Card>
  );
}
