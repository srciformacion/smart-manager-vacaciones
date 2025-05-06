
import React, { useState, useEffect } from 'react';
import { MainLayout } from "@/components/layout/main-layout";
import { useProfileAuth } from "@/hooks/profile/useProfileAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCcw, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function ProfilePage() {
  const { user, userId, loading: authLoading } = useProfileAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchProfile() {
      if (!userId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Fetch profile from Supabase
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        
        setProfile(data);
      } catch (err: any) {
        console.error("Error fetching profile:", err);
        setError("No se pudo cargar el perfil. Por favor, intente de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchProfile();
  }, [userId]);
  
  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // Force re-fetch
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };
  
  return (
    <MainLayout user={user}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Mi perfil</h1>
        <p className="text-muted-foreground">Información del perfil y configuración de la cuenta</p>
        
        {(loading || authLoading) ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="text-sm text-muted-foreground">Cargando perfil...</p>
              </div>
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <p className="text-sm text-destructive">{error}</p>
                <Button variant="outline" size="sm" onClick={handleRetry}>
                  <RefreshCcw className="h-3 w-3 mr-2" /> Reintentar
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : !user ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <User className="h-12 w-12 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Inicie sesión para ver su perfil</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Información personal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nombre</p>
                  <p>{profile?.name || user.name || "No configurado"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Apellido</p>
                  <p>{profile?.surname || "No configurado"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Correo electrónico</p>
                  <p>{profile?.email || user.email || "No configurado"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">DNI</p>
                  <p>{profile?.dni || "No configurado"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Departamento</p>
                  <p>{profile?.department || "No configurado"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fecha de inicio</p>
                  <p>{profile?.start_date ? new Date(profile.start_date).toLocaleDateString() : "No configurado"}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Acciones</CardTitle>
              </CardHeader>
              <CardContent>
                <Button>Editar perfil</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
