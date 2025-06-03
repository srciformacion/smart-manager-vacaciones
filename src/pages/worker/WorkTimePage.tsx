
import { MainLayout } from "@/components/layout/main-layout";
import { useAuth } from "@/hooks/auth";
import { WorkTimeClock } from "@/components/work-time/work-time-clock";
import { WorkTimeHistory } from "@/components/work-time/work-time-history";
import { useWorkTimeConfig } from "@/hooks/work-time/use-work-time-config";
import { User } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function WorkTimePage() {
  const { user: authUser } = useAuth();
  const { config, loading } = useWorkTimeConfig();

  // Convert Supabase user to our User type
  const user: User | null = authUser ? {
    id: authUser.id,
    name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || "Usuario",
    email: authUser.email || "",
    role: "worker" // Default role, you might want to get this from user metadata or profile
  } : null;

  if (loading) {
    return (
      <MainLayout user={user}>
        <div className="text-center py-8">Cargando módulo de jornada...</div>
      </MainLayout>
    );
  }

  if (!config?.is_enabled) {
    return (
      <MainLayout user={user}>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Registro de Jornada Laboral</h1>
            <p className="text-muted-foreground">
              Registra tu entrada, salida y pausas durante la jornada laboral
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Módulo no disponible
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <h2 className="text-xl font-semibold mb-4">El módulo está desactivado</h2>
                <p className="text-muted-foreground mb-4">
                  El módulo de registro de jornada laboral no está activado. 
                  Contacta con el departamento de RRHH para que lo active desde la configuración.
                </p>
                <div className="text-sm text-muted-foreground">
                  <p><strong>Para RRHH:</strong></p>
                  <p>Ve a RRHH → Gestión de Jornada Laboral → Configuración</p>
                  <p>Activa el interruptor "Activar Módulo de Jornada Laboral"</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Registro de Jornada Laboral</h1>
          <p className="text-muted-foreground">
            Registra tu entrada, salida y pausas durante la jornada laboral
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WorkTimeClock />
          <WorkTimeHistory />
        </div>
      </div>
    </MainLayout>
  );
}
