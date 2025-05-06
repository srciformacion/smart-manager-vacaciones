
import React from 'react';
import { MainLayout } from "@/components/layout/main-layout";
import { useProfileAuth } from "@/hooks/profile/useProfileAuth";

export default function HRReportsPage() {
  const { user } = useProfileAuth();
  
  return (
    <MainLayout user={user}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Informes</h1>
        <p className="text-muted-foreground">Genera informes y estadísticas</p>
        
        {/* Contenido de informes se añadirá posteriormente */}
        <div className="py-10 text-center">
          <p>Contenido de informes en desarrollo</p>
        </div>
      </div>
    </MainLayout>
  );
}
