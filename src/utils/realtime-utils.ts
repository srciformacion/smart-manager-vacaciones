
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
    // Enable realtime for the table
    const { data, error } = await supabase
      .from(config.table)
      .on(config.event || '*', (payload) => {
        console.log('Realtime payload:', payload);
      })
      .subscribe();

    if (error) {
      console.error(`Error enabling realtime for ${config.table}:`, error);
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
