
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CalendarSyncProps {
  userId?: string;
}

export function CalendarSync({ userId }: CalendarSyncProps) {
  const [syncGoogle, setSyncGoogle] = useState(false);
  const [syncOutlook, setSyncOutlook] = useState(false);
  const [syncApple, setSyncApple] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Función para sincronizar calendarios (simulada por ahora)
  const handleSync = async () => {
    if (!userId) {
      toast.error("Debes iniciar sesión para sincronizar calendarios");
      return;
    }
    
    // Si no hay ninguna sincronización activada
    if (!syncGoogle && !syncOutlook && !syncApple) {
      toast.error("Por favor selecciona al menos una plataforma para sincronizar");
      return;
    }
    
    setSyncing(true);
    
    try {
      // Simulamos la sincronización (esto sería reemplazado por la API real)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Guardar preferencias de sincronización en Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          sync_preferences: {
            google: syncGoogle,
            outlook: syncOutlook,
            apple: syncApple,
            last_synced: new Date().toISOString()
          }
        })
        .eq('id', userId);
        
      if (error) {
        throw error;
      }
      
      // Mostrar mensaje de éxito
      toast.success("Calendarios sincronizados correctamente");
    } catch (error: any) {
      console.error("Error syncing calendars:", error);
      toast.error(`Error al sincronizar: ${error.message}`);
    } finally {
      setSyncing(false);
    }
  };

  // Cargar preferencias de sincronización guardadas
  const loadSyncPreferences = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('sync_preferences')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error("Error loading sync preferences:", error);
        return;
      }
      
      if (data?.sync_preferences) {
        setSyncGoogle(data.sync_preferences.google || false);
        setSyncOutlook(data.sync_preferences.outlook || false);
        setSyncApple(data.sync_preferences.apple || false);
      }
    } catch (error) {
      console.error("Error loading sync preferences:", error);
    }
  };

  // Cargar preferencias al montar el componente
  useState(() => {
    loadSyncPreferences();
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sincronización de calendarios</CardTitle>
        <CardDescription>
          Sincroniza tu calendario laboral con otras plataformas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="google-sync" className="flex items-center space-x-2">
              <img src="/google-calendar.svg" alt="Google Calendar" className="h-6 w-6" />
              <span>Sincronizar con Google Calendar</span>
            </Label>
            <Switch
              id="google-sync"
              checked={syncGoogle}
              onCheckedChange={setSyncGoogle}
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="outlook-sync" className="flex items-center space-x-2">
              <img src="/outlook-calendar.svg" alt="Outlook Calendar" className="h-6 w-6" />
              <span>Sincronizar con Outlook Calendar</span>
            </Label>
            <Switch
              id="outlook-sync"
              checked={syncOutlook}
              onCheckedChange={setSyncOutlook}
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="apple-sync" className="flex items-center space-x-2">
              <img src="/apple-calendar.svg" alt="Apple Calendar" className="h-6 w-6" />
              <span>Sincronizar con Apple Calendar</span>
            </Label>
            <Switch
              id="apple-sync"
              checked={syncApple}
              onCheckedChange={setSyncApple}
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            La sincronización permitirá que tus turnos aparezcan en los calendarios seleccionados.
          </div>
          
          <Button 
            onClick={handleSync} 
            className="w-full"
            disabled={syncing}
          >
            {syncing ? "Sincronizando..." : "Sincronizar ahora"}
          </Button>
          
          <div className="text-xs text-muted-foreground text-center">
            Última sincronización: {new Date().toLocaleDateString('es-ES', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
