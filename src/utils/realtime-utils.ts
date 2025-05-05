
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Enable realtime for a table
export async function enableRealtimeForTable(tableName: string): Promise<void> {
  try {
    // Set table for realtime
    const { error } = await supabase.rpc('enable_realtime', {
      table_name: tableName
    });
    
    if (error) {
      console.warn(`Could not enable realtime for ${tableName}:`, error);
    } else {
      console.log(`Realtime enabled for ${tableName}`);
    }
  } catch (err) {
    console.error(`Error enabling realtime for ${tableName}:`, err);
    throw err;
  }
}

// Initialize the channel for PostgreSQL changes
export function initPostgresChangeChannel<T>(
  channel: string,
  table: string,
  eventTypes: string[],
  callback: (payload: T) => void
): RealtimeChannel {
  const realtimeChannel = supabase
    .channel(channel)
    .on(
      'postgres_changes' as any, // Use any to avoid the error of types
      { event: eventTypes, schema: 'public', table },
      (payload) => {
        console.log('Realtime change detected:', payload);
        callback(payload as unknown as T);
      }
    )
    .subscribe();

  return realtimeChannel;
}
