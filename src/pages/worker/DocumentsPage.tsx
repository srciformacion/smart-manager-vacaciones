
import React from 'react';
import { MainLayout } from "@/components/layout/main-layout";
import { useProfileAuth } from "@/hooks/profile/useProfileAuth";

export default function DocumentsPage() {
  const { user } = useProfileAuth();
  
  return (
    <MainLayout user={user}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Mis documentos</h1>
        <p className="text-muted-foreground">Accede y gestiona tus documentos laborales</p>
        
        {/* Contenido de documentos se añadirá posteriormente */}
        <div className="py-10 text-center">
          <p>Contenido de documentos en desarrollo</p>
        </div>
      </div>
    </MainLayout>
  );
}
