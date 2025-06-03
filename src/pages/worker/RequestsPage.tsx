
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/main-layout";
import { RequestList } from "@/components/requests/request-list";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Clock, Users, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfileAuth } from "@/hooks/profile/useProfileAuth";
import { Request } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { VacationRulesDisplay } from "@/components/vacation/vacation-rules-display";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RequestsPage() {
  const { user } = useProfileAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [showVacationRules, setShowVacationRules] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('requests')
          .select('*')
          .eq('userid', user.id)
          .order('createdat', { ascending: false });
        
        if (error) throw error;
        
        if (data) {
          const mappedRequests: Request[] = data.map(req => ({
            id: req.id,
            userId: req.userid,
            type: req.type,
            startDate: new Date(req.startdate),
            endDate: new Date(req.enddate),
            status: req.status,
            createdAt: new Date(req.createdat),
            updatedAt: new Date(req.updatedat),
            reason: req.reason,
            observations: req.notes,
            attachmentUrl: req.attachmenturl,
            startTime: req.starttime,
            endTime: req.endtime,
          }));
          
          setRequests(mappedRequests);
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar las solicitudes"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user?.id]);

  const handleVacationRequest = () => {
    setShowVacationRules(true);
  };

  const proceedToVacationForm = () => {
    navigate("/vacation-request");
  };

  if (!user) return null;

  return (
    <MainLayout user={user}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Mis Solicitudes</h1>
            <p className="text-muted-foreground mt-2">
              Gestiona tus solicitudes de permisos, vacaciones y cambios de turno
            </p>
          </div>
        </div>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Crear Solicitud</TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="space-y-6">
            {showVacationRules ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Solicitud de Vacaciones</h2>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowVacationRules(false)}
                  >
                    ← Volver
                  </Button>
                </div>
                
                <VacationRulesDisplay user={user} />
                
                <div className="flex justify-center">
                  <Button 
                    onClick={proceedToVacationForm}
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Continuar con la Solicitud
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleVacationRequest}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Vacaciones</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-xs">
                      Solicitar días de vacaciones según las reglas de tu grupo de trabajo
                    </CardDescription>
                    <Button size="sm" className="w-full mt-3">
                      <Plus className="h-4 w-4 mr-1" />
                      Solicitar
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/personal-day-request")}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Asuntos Propios</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-xs">
                      Solicitar días por asuntos personales
                    </CardDescription>
                    <Button size="sm" className="w-full mt-3">
                      <Plus className="h-4 w-4 mr-1" />
                      Solicitar
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/shift-change-request")}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Cambio de Turno</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-xs">
                      Intercambiar turno con otro compañero
                    </CardDescription>
                    <Button size="sm" className="w-full mt-3">
                      <Plus className="h-4 w-4 mr-1" />
                      Solicitar
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/leave-request")}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Permisos</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-xs">
                      Solicitar permisos con documentación
                    </CardDescription>
                    <Button size="sm" className="w-full mt-3">
                      <Plus className="h-4 w-4 mr-1" />
                      Solicitar
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="history">
            <RequestList
              requests={requests}
              isLoading={loading}
              showWorkerInfo={false}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
