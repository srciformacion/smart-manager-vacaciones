import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Inicializar el canal para los cambios de PostgreSQL
export function initPostgresChangeChannel<T>(
  channel: string,
  table: string,
  eventTypes: string[],
  callback: (payload: T) => void
): RealtimeChannel {
  const realtimeChannel = supabase
    .channel(channel)
    .on(
      'postgres_changes' as any, // Usar any para evitar el error de tipos
      { event: eventTypes, schema: 'public', table },
      (payload) => {
        console.log('Cambio en tiempo real detectado:', payload);
        callback(payload as unknown as T);
      }
    )
    .subscribe();

  return realtimeChannel;
}
