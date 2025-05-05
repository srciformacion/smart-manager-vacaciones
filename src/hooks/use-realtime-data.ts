
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { enableRealtimeForTable } from '@/utils/realtime-utils';

type RealtimeSubscription = {
  tableName: string;
  schema?: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
}

/**
 * Hook para suscribirse a cambios en tiempo real en una tabla de Supabase
 */
export function useRealtimeData<T>(
  subscription: RealtimeSubscription,
  initialData: T[] = [],
  onDataChange?: (newData: T[]) => void
) {
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Función para cargar los datos iniciales
  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const { data: fetchedData, error } = await supabase
        .from(subscription.tableName)
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) throw error;

      setData(fetchedData as T[]);
      if (onDataChange) onDataChange(fetchedData as T[]);
    } catch (err: any) {
      console.error(`Error fetching ${subscription.tableName}:`, err);
      setError(err);
      toast.error(`Error al cargar datos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para suscribirse a cambios en tiempo real
  useEffect(() => {
    // Cargar datos iniciales
    fetchInitialData();

    // Habilitar tiempo real para la tabla si no está habilitado
    const setupRealtime = async () => {
      try {
        // Intentar habilitar la funcionalidad de tiempo real para la tabla
        await enableRealtimeForTable(supabase, {
          table: subscription.tableName,
          event: subscription.event,
          schema: subscription.schema,
          filter: subscription.filter
        });
      } catch (err) {
        console.warn(`No se pudo habilitar tiempo real para ${subscription.tableName}:`, err);
        // No interrumpimos la ejecución, ya que puede que la tabla ya tenga tiempo real habilitado
      }
    };
    
    setupRealtime();

    // Crear un canal para actualizaciones en tiempo real
    const channelName = `realtime:${subscription.tableName}`;
    
    // Configuramos los parámetros para la suscripción
    const params: any = {
      event: subscription.event || '*',
      schema: subscription.schema || 'public',
      table: subscription.tableName,
    };
    
    // Si hay un filtro, lo añadimos a los parámetros
    if (subscription.filter) {
      params.filter = subscription.filter;
    }
    
    // Crear el canal y suscribirse a los cambios con la sintaxis correcta
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes' as any, params, async (payload: any) => {
        console.log('Cambio en tiempo real recibido:', payload);
        
        // Refrescar datos después de un cambio
        await fetchInitialData();
        
        // Notificar al usuario sobre el cambio
        const eventType = payload.eventType;
        if (eventType === 'INSERT') {
          toast.info('Se ha recibido una nueva solicitud');
        } else if (eventType === 'UPDATE') {
          toast.info('Una solicitud ha sido actualizada');
        } else if (eventType === 'DELETE') {
          toast.info('Una solicitud ha sido eliminada');
        }
      })
      .subscribe((status) => {
        console.log(`Estado de la suscripción a ${subscription.tableName}:`, status);
        
        if (status === 'SUBSCRIBED') {
          console.log(`Suscripción exitosa a cambios en ${subscription.tableName}`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`Error en el canal para ${subscription.tableName}`);
          toast.error(`Error en la conexión en tiempo real`);
        }
      });

    // Limpieza al desmontar
    return () => {
      supabase.removeChannel(channel);
    };
  }, [subscription.tableName, subscription.event, subscription.schema, subscription.filter]);

  return {
    data,
    loading,
    error,
    refresh: fetchInitialData
  };
}
