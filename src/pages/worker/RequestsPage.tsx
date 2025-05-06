
import React, { useState, useEffect } from 'react';
import { MainLayout } from "@/components/layout/main-layout";
import { useProfileAuth } from "@/hooks/profile/useProfileAuth";
import { RequestList } from "@/components/requests/request-list";
import { exampleRequests } from "@/data/example-requests";
import { exampleUser } from "@/data/example-users";
import { Card, CardContent } from "@/components/ui/card";
import { FileX } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Request } from "@/types";
import { useToast } from "@/components/ui/use-toast";

export default function RequestsPage() {
  const { user, userId } = useProfileAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    async function fetchRequests() {
      try {
        setLoading(true);
        
        // Check if we're in demo mode (userId starts with "demo-" or is undefined)
        if (!userId || (typeof userId === 'string' && userId.startsWith('demo-'))) {
          console.log("Using example requests for demo mode");
          // Use example data for demo purposes
          setRequests(exampleRequests);
          setLoading(false);
          return;
        }
        
        // We have a real UUID, fetch from Supabase
        console.log("Fetching requests for user:", userId);
        const { data, error } = await supabase
          .from('requests')
          .select('*')
          .eq('userid', userId);
          
        if (error) {
          throw error;
        }
        
        // Transform data to match Request type if needed
        const transformedRequests: Request[] = data?.map((req: any) => ({
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
          observations: req.notes // Map notes to observations
        })) || [];
        
        setRequests(transformedRequests);
      } catch (err: any) {
        console.error("Error fetching requests:", err);
        // Fallback to example data in case of error
        setRequests(exampleRequests);
        setError("No se pudieron cargar las solicitudes desde la base de datos. Mostrando datos de ejemplo.");
        
        toast({
          variant: "destructive",
          title: "Error al cargar solicitudes",
          description: err.message || "No se pudieron cargar las solicitudes"
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchRequests();
  }, [userId, toast]);
  
  const handleViewDetails = (request: Request) => {
    console.log("Ver detalles de solicitud:", request);
    toast({
      title: "Ver detalles",
      description: `Solicitud: ${request.id.substring(0, 8)}...`
    });
  };
  
  const handleDownloadAttachment = (request: Request) => {
    if (request.attachmentUrl) {
      window.open(request.attachmentUrl, '_blank');
      
      toast({
        title: "Descargando adjunto",
        description: "Se ha abierto el archivo adjunto en una nueva ventana"
      });
    }
  };
  
  return (
    <MainLayout user={user || exampleUser}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Mis solicitudes</h1>
        <p className="text-muted-foreground">Gestiona tus solicitudes de permisos, vacaciones y cambios de turno</p>
        
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
                <FileX className="h-12 w-12 text-amber-500" />
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <RequestList 
            requests={requests} 
            onViewDetails={handleViewDetails}
            onDownloadAttachment={handleDownloadAttachment}
          />
        )}
      </div>
    </MainLayout>
  );
}
