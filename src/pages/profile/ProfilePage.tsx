
import React from 'react';
import { MainLayout } from "@/components/layout/main-layout";
import { useProfileAuth } from "@/hooks/profile/useProfileAuth";

export default function ProfilePage() {
  const { user } = useProfileAuth();
  
  return (
    <MainLayout user={user}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Mi perfil</h1>
        <p className="text-muted-foreground">Información del perfil y configuración de la cuenta</p>
        
        {/* Contenido del perfil se añadirá posteriormente */}
        <div className="py-10 text-center">
          <p>Contenido del perfil en desarrollo</p>
        </div>
      </div>
    </MainLayout>
  );
}
