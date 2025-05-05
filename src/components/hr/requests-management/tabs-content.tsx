
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RequestTable } from "@/components/requests/table/request-table";
import { Request, User, RequestStatus } from "@/types";

interface TabsContentProps {
  status: string;
  searchTerm: string;
  selectedDate: Date | undefined;
}

export function TabsContent({ status, searchTerm, selectedDate }: TabsContentProps) {
  // En una implementación real, aquí usaríamos los filtros para obtener datos de Supabase
  const [requests, setRequests] = useState<Request[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Esta función simularía obtener datos filtrados
  const getFilteredData = () => {
    setLoading(true);
    // Aquí iría el código para filtrar según status, searchTerm y selectedDate
    // Por ahora dejamos el arreglo vacío
    setLoading(false);
  };

  const handleViewDetails = (request: Request) => {
    console.log("Ver detalles de solicitud:", request);
  };

  const handleStatusChange = (request: Request, newStatus: RequestStatus) => {
    console.log(`Cambiar estado de solicitud ${request.id} a ${newStatus}`);
  };

  const handleDownloadAttachment = (request: Request) => {
    console.log("Descargar adjunto:", request.attachmentUrl);
  };

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
        {loading ? (
          <div className="text-center py-8">Cargando...</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay solicitudes que coincidan con los criterios de búsqueda
          </div>
        ) : (
          <RequestTable
            requests={requests}
            users={users}
            isHRView={true}
            onViewDetails={handleViewDetails}
            onStatusChange={handleStatusChange}
            onDownloadAttachment={handleDownloadAttachment}
          />
        )}
      </CardContent>
    </Card>
  );
}
