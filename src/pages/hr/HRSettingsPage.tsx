
import React from 'react';
import { MainLayout } from "@/components/layout/main-layout";
import { useProfileAuth } from "@/hooks/profile/useProfileAuth";

export default function HRSettingsPage() {
  const { user } = useProfileAuth();
  
  return (
    <MainLayout user={user}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Configuración RRHH</h1>
        <p className="text-muted-foreground">Ajustes y configuraciones del sistema</p>
        
        {/* Contenido de configuración se añadirá posteriormente */}
        <div className="py-10 text-center">
          <p>Contenido de configuración en desarrollo</p>
        </div>
      </div>
    </MainLayout>
  );
}
