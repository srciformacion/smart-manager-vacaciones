
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { CalendarManagement } from "@/components/hr/calendar/calendar-management";
import { CalendarExcelImport } from "@/components/hr/calendar/calendar-excel-import";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exampleUser, exampleWorkers } from "@/data/example-users";
import { useProfileAuth } from "@/hooks/profile/useProfileAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";

export default function CalendarManagementPage() {
  const { user, fetchAuthUser } = useProfileAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("calendar");
  const { userRole } = useAuth();
  
  // Verificamos que tanto el usuario autenticado como el usuario demo con rol HR puedan acceder
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Intentar obtener el usuario autenticado
        const authUser = await fetchAuthUser();
        
        // Para usuarios demo, verificamos el rol en localStorage
        const demoRole = localStorage.getItem("userRole");
        const demoUser = localStorage.getItem("user");
        
        // Si no hay usuario autenticado ni usuario demo, redireccionar a login
        if (!authUser && (!demoUser || !demoRole)) {
          toast.error("Por favor inicia sesión para acceder a la gestión de calendarios");
          navigate('/auth');
          return;
        }
        
        // Verificamos permisos basados en rol
        if (userRole !== 'hr' && demoRole !== 'hr') {
          toast.error("No tienes permisos para acceder a esta página");
          navigate('/');
          return;
        }
        
        console.log("Acceso permitido a CalendarManagementPage - Role:", userRole || demoRole);
        setLoading(false);
      } catch (error) {
        console.error("Auth check error:", error);
        toast.error("Error al verificar autenticación");
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [fetchAuthUser, navigate, userRole]);

  if (loading) {
    return (
      <MainLayout user={exampleUser}>
        <div className="space-y-8">
          <Skeleton className="h-10 w-[300px]" />
          <Skeleton className="h-[600px]" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout user={user || exampleUser}>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestión de calendarios y turnos</h1>
            <p className="text-muted-foreground mt-2">
              Administre los calendarios laborales y turnos del personal
            </p>
          </div>
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="calendar">Calendario</TabsTrigger>
            <TabsTrigger value="excel">Importar/Exportar Excel</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar">
            <CalendarManagement workers={exampleWorkers} />
          </TabsContent>
          
          <TabsContent value="excel">
            <CalendarExcelImport users={exampleWorkers} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
