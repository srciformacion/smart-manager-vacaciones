
import React, { useState, useEffect } from 'react';
import { MainLayout } from "@/components/layout/main-layout";
import { useProfileAuth } from "@/hooks/profile/useProfileAuth";
import { exampleRequests } from "@/data/example-requests";
import { exampleUser, exampleWorkers } from "@/data/example-users";
import { RequestList } from "@/components/requests/request-list";
import { Card, CardContent } from "@/components/ui/card";
import { FileX } from "lucide-react";
import { Request, RequestStatus } from "@/types";

export default function HRRequestsPage() {
  const { user, userId } = useProfileAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // For HR page we'll use example data since this is a demo
    setRequests(exampleRequests);
    setLoading(false);
  }, []);
  
  const handleViewDetails = (request: Request) => {
    console.log("Ver detalles de solicitud:", request);
    // Implement view details functionality
  };
  
  const handleStatusChange = (request: Request, newStatus: RequestStatus) => {
    console.log(`Cambiar estado de solicitud ${request.id} a ${newStatus}`);
    // Update the request status
    const updatedRequests = requests.map(req => 
      req.id === request.id ? { ...req, status: newStatus, updatedAt: new Date() } : req
    );
    setRequests(updatedRequests);
  };
  
  const handleDownloadAttachment = (request: Request) => {
    if (request.attachmentUrl) {
      console.log("Descargar adjunto:", request.attachmentUrl);
      window.open(request.attachmentUrl, '_blank');
    }
  };
  
  return (
    <MainLayout user={user}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Gestión de solicitudes</h1>
        <p className="text-muted-foreground">Administra las solicitudes de los empleados</p>
        
        {loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="text-sm text-muted-foreground">Cargando solicitudes...</p>
              </div>
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <FileX className="h-12 w-12 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <RequestList 
            requests={requests}
            users={exampleWorkers}
            isHRView={true}
            onViewDetails={handleViewDetails}
            onStatusChange={handleStatusChange}
            onDownloadAttachment={handleDownloadAttachment}
          />
        )}
      </div>
    </MainLayout>
  );
}
