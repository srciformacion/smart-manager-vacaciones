
import React from 'react';
import { MainLayout } from "@/components/layout/main-layout";
import { useProfileAuth } from "@/hooks/profile/useProfileAuth";

export default function RequestsPage() {
  const { user } = useProfileAuth();
  
  return (
    <MainLayout user={user}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Mis solicitudes</h1>
        <p className="text-muted-foreground">Gestiona tus solicitudes de permisos, vacaciones y cambios de turno</p>
        
        {/* Contenido de solicitudes se añadirá posteriormente */}
        <div className="py-10 text-center">
          <p>Contenido de solicitudes en desarrollo</p>
        </div>
      </div>
    </MainLayout>
  );
}
