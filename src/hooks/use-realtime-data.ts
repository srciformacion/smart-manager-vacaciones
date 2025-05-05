
import { useState, useEffect, useCallback } from 'react';
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
  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      console.log(`Fetching data from ${subscription.tableName}...`);
      
      const { data: fetchedData, error } = await supabase
        .from(subscription.tableName)
        .select('*')
        .order('createdat', { ascending: false });

      if (error) throw error;

      console.log(`Fetched ${fetchedData?.length || 0} records from ${subscription.tableName}`);
      setData(fetchedData as T[]);
      if (onDataChange) onDataChange(fetchedData as T[]);
      setError(null);
    } catch (err: any) {
      console.error(`Error fetching ${subscription.tableName}:`, err);
      setError(err);
      toast.error(`Error al cargar datos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [subscription.tableName, onDataChange]);

  // Efecto para suscribirse a cambios en tiempo real
  useEffect(() => {
    // Cargar datos iniciales
    fetchInitialData();

    // Habilitar tiempo real para la tabla si no está habilitado
    const setupRealtime = async () => {
      try {
        // Intentar habilitar la funcionalidad de tiempo real para la tabla
        const result = await enableRealtimeForTable(supabase, {
          table: subscription.tableName,
          event: subscription.event,
          schema: subscription.schema,
          filter: subscription.filter
        });
        
        if (result.success) {
          console.log(`Realtime enabled for ${subscription.tableName}`);
        } else {
          console.warn(`Could not enable realtime for ${subscription.tableName}:`, result.error);
        }
      } catch (err) {
        console.warn(`Error enabling realtime for ${subscription.tableName}:`, err);
      }
    };
    
    setupRealtime();

    // Crear un canal para actualizaciones en tiempo real
    const channelName = `realtime:${subscription.tableName}`;
    
    // Create the channel and subscribe to changes using the Supabase realtime API
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes' as any, // Type assertion to fix TypeScript error
        {
          event: subscription.event || '*',
          schema: subscription.schema || 'public',
          table: subscription.tableName,
          ...(subscription.filter ? { filter: subscription.filter } : {})
        },
        async (payload) => {
          console.log(`Realtime update for ${subscription.tableName}:`, payload);
          
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
        }
      )
      .subscribe((status) => {
        console.log(`Realtime subscription status for ${subscription.tableName}:`, status);
        
        if (status === 'SUBSCRIBED') {
          console.log(`Successfully subscribed to changes in ${subscription.tableName}`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`Channel error for ${subscription.tableName}`);
          toast.error(`Error en la conexión en tiempo real`);
        }
      });

    // Limpieza al desmontar
    return () => {
      supabase.removeChannel(channel);
    };
  }, [subscription.tableName, subscription.event, subscription.schema, subscription.filter, fetchInitialData]);

  return {
    data,
    loading,
    error,
    refresh: fetchInitialData
  };
}
