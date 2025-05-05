
import { Session, SupabaseClient } from "@supabase/supabase-js";

export interface RealtimeConfig {
  table: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  schema?: string;
  filter?: string;
}

/**
 * Enables realtime subscription for a table
 */
export const enableRealtimeForTable = async (
  supabase: SupabaseClient,
  config: RealtimeConfig
): Promise<{ success: boolean; error: Error | null }> => {
  try {
    // Create channel for the specific table
    const channelName = `channel_${config.table}`;
    
    // Create channel with correct configuration
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: config.event || '*',
          schema: config.schema || 'public',
          table: config.table,
          ...(config.filter ? { filter: config.filter } : {})
        },
        (payload) => {
          console.log('Realtime payload:', payload);
        }
      )
      .subscribe();

    if (!channel) {
      const error = new Error(`Error enabling realtime for ${config.table}`);
      console.error(error);
      return { success: false, error };
    }

    console.log(`Realtime enabled for ${config.table}`);
    return { success: true, error: null };
  } catch (error) {
    console.error(`Error in enableRealtimeForTable:`, error);
    return { success: false, error: error as Error };
  }
};

/**
 * Disables all realtime subscriptions
 */
export const disableAllRealtime = (supabase: SupabaseClient): void => {
  try {
    supabase.removeAllChannels();
    console.log('All realtime subscriptions removed');
  } catch (error) {
    console.error('Error disabling realtime:', error);
  }
};
