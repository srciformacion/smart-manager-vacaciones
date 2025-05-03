
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

    // Configurar la suscripción en tiempo real
    const channel = supabase
      .channel('table-changes')
      .on(
        'postgres_changes',
        {
          event: subscription.event || '*',
          schema: subscription.schema || 'public',
          table: subscription.tableName,
          filter: subscription.filter || undefined,
        },
        async (payload) => {
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
        }
      )
      .subscribe();

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
