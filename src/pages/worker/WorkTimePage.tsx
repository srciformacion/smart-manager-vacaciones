
import { MainLayout } from "@/components/layout/main-layout";
import { useAuth } from "@/hooks/auth";
import { WorkTimeClock } from "@/components/work-time/work-time-clock";
import { WorkTimeHistory } from "@/components/work-time/work-time-history";
import { useWorkTimeConfig } from "@/hooks/work-time/use-work-time-config";

export default function WorkTimePage() {
  const { user } = useAuth();
  const { config, loading } = useWorkTimeConfig();

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
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-4">Módulo no disponible</h2>
          <p className="text-muted-foreground">
            El módulo de registro de jornada laboral no está activado.
          </p>
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
