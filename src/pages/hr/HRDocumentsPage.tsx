
import React from 'react';
import { MainLayout } from "@/components/layout/main-layout";
import { useProfileAuth } from "@/hooks/profile/useProfileAuth";

export default function HRDocumentsPage() {
  const { user } = useProfileAuth();
  
  return (
    <MainLayout user={user}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Gestión de documentos</h1>
        <p className="text-muted-foreground">Administra documentos y plantillas</p>
        
        {/* Contenido de gestión de documentos se añadirá posteriormente */}
        <div className="py-10 text-center">
          <p>Contenido de gestión de documentos en desarrollo</p>
        </div>
      </div>
    </MainLayout>
  );
}
