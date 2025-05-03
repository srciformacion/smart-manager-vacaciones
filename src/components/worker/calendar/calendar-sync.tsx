
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarClock, RefreshCw, Check, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface SyncOption {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  platform: string;
  lastSync?: Date;
}

export function CalendarSync() {
  const [syncOptions, setSyncOptions] = useState<SyncOption[]>([]);
  const [syncInProgress, setSyncInProgress] = useState<boolean>(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("google");
  const [email, setEmail] = useState<string>("");
  
  // Cargar configuraciones de sincronización
  useEffect(() => {
    const fetchSyncSettings = async () => {
      try {
        // Simular carga de configuraciones de Supabase
        const { data, error } = await supabase
          .from('calendar_sync_settings')
          .select('*');
          
        if (error) {
          // Si hay error, usamos datos de ejemplo
          const defaultOptions: SyncOption[] = [
            {
              id: "google",
              name: "Google Calendar",
              description: "Sincroniza tus turnos con Google Calendar",
              enabled: false,
              platform: "google"
            },
            {
              id: "outlook",
              name: "Microsoft Outlook",
              description: "Sincroniza tus turnos con Microsoft Outlook",
              enabled: false,
              platform: "outlook"
            },
            {
              id: "phone",
              name: "Calendario del teléfono",
              description: "Exporta tus turnos a tu dispositivo móvil",
              enabled: false,
              platform: "ical"
            }
          ];
          
          setSyncOptions(defaultOptions);
          return;
        }
        
        // Si hay datos, los transformamos al formato esperado
        if (data && data.length > 0) {
          const mappedOptions: SyncOption[] = data.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description,
            enabled: item.enabled,
            platform: item.platform,
            lastSync: item.last_sync ? new Date(item.last_sync) : undefined
          }));
          
          setSyncOptions(mappedOptions);
        } else {
          // Usar datos por defecto si no hay registros
          const defaultOptions: SyncOption[] = [
            {
              id: "google",
              name: "Google Calendar",
              description: "Sincroniza tus turnos con Google Calendar",
              enabled: false,
              platform: "google"
            },
            {
              id: "outlook",
              name: "Microsoft Outlook",
              description: "Sincroniza tus turnos con Microsoft Outlook",
              enabled: false,
              platform: "outlook"
            },
            {
              id: "phone",
              name: "Calendario del teléfono",
              description: "Exporta tus turnos a tu dispositivo móvil",
              enabled: false,
              platform: "ical"
            }
          ];
          
          setSyncOptions(defaultOptions);
        }
      } catch (error) {
        console.error("Error fetching sync settings:", error);
        // Usar datos por defecto en caso de error
        const defaultOptions: SyncOption[] = [
          {
            id: "google",
            name: "Google Calendar",
            description: "Sincroniza tus turnos con Google Calendar",
            enabled: false,
            platform: "google"
          },
          {
            id: "outlook",
            name: "Microsoft Outlook",
            description: "Sincroniza tus turnos con Microsoft Outlook",
            enabled: false,
            platform: "outlook"
          },
          {
            id: "phone",
            name: "Calendario del teléfono",
            description: "Exporta tus turnos a tu dispositivo móvil",
            enabled: false,
            platform: "ical"
          }
        ];
        
        setSyncOptions(defaultOptions);
      }
    };
    
    fetchSyncSettings();
  }, []);

  const toggleSync = async (id: string) => {
    // Actualizar estado local primero para UI responsiva
    setSyncOptions(prevOptions => 
      prevOptions.map(option => 
        option.id === id ? { ...option, enabled: !option.enabled } : option
      )
    );
    
    try {
      // Obtener la opción que se está modificando
      const option = syncOptions.find(o => o.id === id);
      if (!option) return;
      
      // Actualizar en Supabase
      const { error } = await supabase
        .from('calendar_sync_settings')
        .upsert({
          id: option.id,
          name: option.name,
          description: option.description,
          platform: option.platform,
          enabled: !option.enabled,
          last_sync: option.lastSync?.toISOString()
        });
        
      if (error) throw error;
      
      toast.success(`Sincronización ${!option.enabled ? "habilitada" : "deshabilitada"} para ${option.name}`);
    } catch (error) {
      console.error("Error toggling sync:", error);
      toast.error("Error al actualizar la configuración de sincronización");
      
      // Revertir cambio en UI si hay error
      setSyncOptions(prevOptions => 
        prevOptions.map(option => 
          option.id === id ? { ...option, enabled: !option.enabled } : option
        )
      );
    }
  };

  const handleSync = async () => {
    setSyncInProgress(true);
    
    try {
      // Simular proceso de sincronización
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Actualizar fecha de última sincronización
      const now = new Date();
      setSyncOptions(prevOptions => 
        prevOptions.map(option => 
          option.enabled ? { ...option, lastSync: now } : option
        )
      );
      
      // Actualizar en Supabase para las opciones habilitadas
      const enabledOptions = syncOptions.filter(o => o.enabled);
      
      for (const option of enabledOptions) {
        await supabase
          .from('calendar_sync_settings')
          .upsert({
            id: option.id,
            name: option.name,
            description: option.description,
            platform: option.platform,
            enabled: option.enabled,
            last_sync: now.toISOString()
          });
      }
      
      toast.success("Sincronización completada correctamente");
    } catch (error) {
      console.error("Error durante la sincronización:", error);
      toast.error("Error durante la sincronización");
    } finally {
      setSyncInProgress(false);
    }
  };

  const handleAddCalendar = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.includes('@')) {
      toast.error("Por favor, introduce un email válido");
      return;
    }
    
    try {
      // Crear nueva configuración de sincronización
      const newOption: SyncOption = {
        id: `${selectedPlatform}-${Date.now()}`,
        name: `${selectedPlatform === 'google' ? 'Google Calendar' : 
               selectedPlatform === 'outlook' ? 'Microsoft Outlook' : 
               'Calendario personalizado'}`,
        description: `Sincronización con ${email}`,
        enabled: true,
        platform: selectedPlatform
      };
      
      // Actualizar estado local
      setSyncOptions([...syncOptions, newOption]);
      
      // Guardar en Supabase
      const { error } = await supabase
        .from('calendar_sync_settings')
        .insert({
          id: newOption.id,
          name: newOption.name,
          description: newOption.description,
          platform: newOption.platform,
          enabled: newOption.enabled,
          email: email
        });
        
      if (error) throw error;
      
      toast.success("Calendario añadido correctamente");
      setEmail("");
    } catch (error) {
      console.error("Error al añadir calendario:", error);
      toast.error("Error al añadir calendario");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sincronización de calendario</CardTitle>
        <CardDescription>
          Mantén tu calendario sincronizado con otras aplicaciones
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {syncOptions.map((option) => (
            <div key={option.id} className="flex items-start space-x-2">
              <Checkbox 
                id={`sync-${option.id}`} 
                checked={option.enabled}
                onCheckedChange={() => toggleSync(option.id)}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor={`sync-${option.id}`} className="text-base">
                  {option.name}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
                {option.lastSync && (
                  <p className="text-xs text-muted-foreground flex items-center mt-1">
                    <CalendarClock className="h-3 w-3 mr-1" />
                    Última sincronización: {option.lastSync.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <Button
          variant="outline"
          className="w-full"
          onClick={handleSync}
          disabled={syncInProgress || !syncOptions.some(o => o.enabled)}
        >
          {syncInProgress ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Sincronizando...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Sincronizar ahora
            </>
          )}
        </Button>
        
        <div className="pt-6 border-t">
          <h3 className="font-medium mb-4">Añadir nuevo calendario</h3>
          <form onSubmit={handleAddCalendar} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-1">
                <Label>Plataforma</Label>
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar plataforma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google">Google Calendar</SelectItem>
                    <SelectItem value="outlook">Microsoft Outlook</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label>Email</Label>
                <div className="flex space-x-2">
                  <Input 
                    type="email"
                    placeholder="Tu dirección de email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button type="submit">
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 text-sm text-muted-foreground">
        <div className="flex space-x-1">
          <CalendarClock className="h-4 w-4" />
          <p>Los cambios pueden tardar hasta 24 horas en sincronizarse completamente.</p>
        </div>
      </CardFooter>
    </Card>
  );
}
