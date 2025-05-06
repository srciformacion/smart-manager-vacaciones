
import React from 'react';
import { MainLayout } from "@/components/layout/main-layout";
import { useProfileAuth } from "@/hooks/profile/useProfileAuth";

export default function HRCalendarPage() {
  const { user } = useProfileAuth();
  
  return (
    <MainLayout user={user}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Calendario de personal</h1>
        <p className="text-muted-foreground">Gestiona los calendarios laborales y turnos</p>
        
        {/* Contenido de gestión de calendario se añadirá posteriormente */}
        <div className="py-10 text-center">
          <p>Contenido de gestión de calendario en desarrollo</p>
        </div>
      </div>
    </MainLayout>
  );
}
