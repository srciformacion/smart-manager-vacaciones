
import React, { useState, useEffect } from 'react';
import { MainLayout } from "@/components/layout/main-layout";
import { useProfileAuth } from "@/hooks/profile/useProfileAuth";
import { exampleRequests } from "@/data/example-requests";
import { exampleUser, exampleWorkers } from "@/data/example-users";
import { RequestList } from "@/components/requests/request-list";
import { ApprovalWorkflowView } from "@/components/hr/approval/approval-workflow-view";
import { PendingApprovalsWidget } from "@/components/hr/approval/pending-approvals-widget";
import { useApprovalManagement } from "@/hooks/hr/use-approval-management";
import { Card, CardContent } from "@/components/ui/card";
import { FileX } from "lucide-react";
import { Request, RequestStatus } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HRRequestsPage() {
  const { user, userId } = useProfileAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const { toast } = useToast();
  
  const {
    workflows,
    processApproval,
    getWorkflowByRequestId,
    getPendingApprovals,
  } = useApprovalManagement(requests, exampleWorkers);

  const pendingApprovals = getPendingApprovals(userId || "");
  
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
  
  const handleViewDetails = (request: Request) => {
    setSelectedRequestId(request.id);
  };
  
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

  const handleProcessApproval = (stepId: string, action: "approve" | "reject" | "request_info", comments?: string) => {
    const workflow = workflows.find(w => w.steps.some(s => s.id === stepId));
    if (workflow) {
      processApproval(workflow.id, stepId, userId || "", action, comments);
    }
  };

  const selectedRequest = selectedRequestId ? requests.find(r => r.id === selectedRequestId) : null;
  const selectedWorkflow = selectedRequestId ? getWorkflowByRequestId(selectedRequestId) : null;
  
  return (
    <MainLayout user={user || exampleUser}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Gestión de solicitudes</h1>
        <p className="text-muted-foreground">Administra las solicitudes de los empleados con flujos de aprobación</p>
        
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
          <Tabs defaultValue="pending-approvals" className="w-full">
            <TabsList>
              <TabsTrigger value="pending-approvals">Aprobaciones Pendientes ({pendingApprovals.length})</TabsTrigger>
              <TabsTrigger value="all-requests">Todas las Solicitudes</TabsTrigger>
              {selectedRequest && <TabsTrigger value="workflow">Flujo de Aprobación</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="pending-approvals">
              <PendingApprovalsWidget
                pendingSteps={pendingApprovals}
                requests={requests}
                users={exampleWorkers}
                onViewRequest={(requestId) => {
                  setSelectedRequestId(requestId);
                }}
              />
            </TabsContent>
            
            <TabsContent value="all-requests">
              <RequestList 
                requests={requests}
                users={exampleWorkers}
                isHRView={true}
                onViewDetails={handleViewDetails}
                onStatusChange={handleStatusChange}
                onDownloadAttachment={handleDownloadAttachment}
              />
            </TabsContent>
            
            {selectedRequest && selectedWorkflow && (
              <TabsContent value="workflow">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-lg font-medium">
                      Solicitud de {exampleWorkers.find(w => w.id === selectedRequest.userId)?.name}
                    </h3>
                    <span className="text-muted-foreground">
                      {selectedRequest.startDate.toLocaleDateString()} - {selectedRequest.endDate.toLocaleDateString()}
                    </span>
                  </div>
                  
                  <ApprovalWorkflowView
                    workflow={selectedWorkflow}
                    currentUserId={userId || ""}
                    onProcessApproval={handleProcessApproval}
                  />
                </div>
              </TabsContent>
            )}
          </Tabs>
        )}
      </div>
    </MainLayout>
  );
}
