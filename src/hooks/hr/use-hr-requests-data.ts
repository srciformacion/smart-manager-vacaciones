
import { useState, useEffect } from 'react';
import { Request, RequestStatus } from "@/types";
import { exampleRequests } from "@/data/example-requests";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useHRRequestsData(userId: string | null) {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchRequests() {
      try {
        setLoading(true);
        
        // Check if we're in demo mode or not
        if (!userId || (typeof userId === 'string' && userId.startsWith('demo-'))) {
          console.log("HR page using example data for demo");
          setRequests(exampleRequests);
          setLoading(false);
          return;
        }
        
        // For real users, fetch from Supabase
        console.log("Fetching all requests for HR user");
        const { data, error } = await supabase
          .from('requests')
          .select('*');
          
        if (error) {
          throw error;
        }
        
        // Transform data to match Request type
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
        console.error("Error fetching HR requests:", err);
        // Fallback to example data
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

  const handleStatusChange = (request: Request, newStatus: RequestStatus) => {
    console.log(`Cambiar estado de solicitud ${request.id} a ${newStatus}`);
    // Update the request status
    const updatedRequests = requests.map(req => 
      req.id === request.id ? { ...req, status: newStatus, updatedAt: new Date() } : req
    );
    setRequests(updatedRequests);
    
    // If we're not in demo mode, update in Supabase
    if (userId && !userId.toString().startsWith('demo-')) {
      supabase
        .from('requests')
        .update({ status: newStatus, updatedat: new Date() })
        .eq('id', request.id)
        .then(({ error }) => {
          if (error) {
            console.error("Error updating request status:", error);
            toast({
              variant: "destructive",
              title: "Error al actualizar",
              description: "No se pudo actualizar el estado de la solicitud"
            });
            return;
          }
          
          toast({
            title: "Estado actualizado",
            description: `La solicitud ha sido ${newStatus === 'approved' ? 'aprobada' : newStatus === 'rejected' ? 'rechazada' : 'actualizada'}`
          });
        });
    } else {
      toast({
        title: "Estado actualizado (demo)",
        description: `La solicitud ha sido ${newStatus === 'approved' ? 'aprobada' : newStatus === 'rejected' ? 'rechazada' : 'actualizada'}`
      });
    }
  };

  const handleDownloadAttachment = (request: Request) => {
    if (request.attachmentUrl) {
      console.log("Descargar adjunto:", request.attachmentUrl);
      window.open(request.attachmentUrl, '_blank');
      
      toast({
        title: "Descargando adjunto",
        description: "Se ha abierto el archivo adjunto en una nueva ventana"
      });
    }
  };

  return {
    requests,
    loading,
    error,
    handleStatusChange,
    handleDownloadAttachment
  };
}
