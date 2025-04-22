
import { useState } from "react";
import { Request, RequestStatus, RequestType, User } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { RequestTypeBadge } from "@/components/ui/request-type-badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Download, Search, FileX } from "lucide-react";

interface RequestListProps {
  requests: Request[];
  users?: User[];
  isHRView?: boolean;
  onViewDetails?: (request: Request) => void;
  onStatusChange?: (request: Request, newStatus: RequestStatus) => void;
  onDownloadAttachment?: (request: Request) => void;
}

export function RequestList({
  requests,
  users,
  isHRView = false,
  onViewDetails,
  onStatusChange,
  onDownloadAttachment,
}: RequestListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<RequestType | "all">("all");

  // Filtrar solicitudes según criterios de búsqueda
  const filteredRequests = requests.filter((request) => {
    const matchesSearch = searchTerm === "" || 
      (users && users.find(u => u.id === request.userId)?.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      request.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesType = typeFilter === "all" || request.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Función para obtener el nombre del usuario
  const getUserName = (userId: string) => {
    if (!users) return userId;
    const user = users.find((u) => u.id === userId);
    return user ? user.name : userId;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>
              {isHRView ? "Solicitudes de trabajadores" : "Mis solicitudes"}
            </CardTitle>
            <CardDescription>
              {isHRView 
                ? "Gestione las solicitudes de todos los trabajadores" 
                : "Consulte el estado de sus solicitudes"}
            </CardDescription>
          </div>
          
          {/* Búsqueda y filtros */}
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full md:w-auto"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as RequestStatus | "all")}
              className="px-3 py-2 rounded-md border border-input bg-background text-sm"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="approved">Aprobado</option>
              <option value="rejected">Rechazado</option>
              <option value="moreInfo">Más información</option>
            </select>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as RequestType | "all")}
              className="px-3 py-2 rounded-md border border-input bg-background text-sm"
            >
              <option value="all">Todos los tipos</option>
              <option value="vacation">Vacaciones</option>
              <option value="personalDay">Asuntos propios</option>
              <option value="leave">Permisos justificados</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileX className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No hay solicitudes</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                ? "No se encontraron solicitudes con los filtros aplicados"
                : "Aún no hay solicitudes registradas"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {isHRView && <TableHead>Trabajador</TableHead>}
                  <TableHead>Tipo</TableHead>
                  <TableHead>Fecha inicio</TableHead>
                  <TableHead>Fecha fin</TableHead>
                  <TableHead>Estado</TableHead>
                  {isHRView && <TableHead>Justificante</TableHead>}
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    {isHRView && (
                      <TableCell>{getUserName(request.userId)}</TableCell>
                    )}
                    <TableCell>
                      <RequestTypeBadge type={request.type} />
                    </TableCell>
                    <TableCell>
                      {format(new Date(request.startDate), "dd MMM yyyy", { locale: es })}
                    </TableCell>
                    <TableCell>
                      {format(new Date(request.endDate), "dd MMM yyyy", { locale: es })}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={request.status} />
                    </TableCell>
                    {isHRView && (
                      <TableCell>
                        {request.attachmentUrl ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDownloadAttachment?.(request)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Descargar
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-sm">N/A</span>
                        )}
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewDetails?.(request)}
                        >
                          Detalles
                        </Button>
                        
                        {isHRView && request.status === "pending" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-success/10 text-success hover:bg-success/20"
                              onClick={() => onStatusChange?.(request, "approved")}
                            >
                              Aprobar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-danger/10 text-danger hover:bg-danger/20"
                              onClick={() => onStatusChange?.(request, "rejected")}
                            >
                              Rechazar
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
