
import React from 'react';
import { MainLayout } from "@/components/layout/main-layout";
import { useProfileAuth } from "@/hooks/profile/useProfileAuth";

export default function HRRequestsPage() {
  const { user } = useProfileAuth();
  
  return (
    <MainLayout user={user}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Gestión de solicitudes</h1>
        <p className="text-muted-foreground">Administra las solicitudes de los empleados</p>
        
        {/* Contenido de gestión de solicitudes se añadirá posteriormente */}
        <div className="py-10 text-center">
          <p>Contenido de gestión de solicitudes en desarrollo</p>
        </div>
      </div>
    </MainLayout>
  );
}
