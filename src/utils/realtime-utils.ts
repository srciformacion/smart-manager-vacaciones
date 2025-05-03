
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Habilita la funcionalidad de tiempo real para una tabla específica en Supabase.
 * @param tableName Nombre de la tabla a habilitar para tiempo real
 * @returns Un objeto indicando el éxito o fracaso de la operación
 */
export const enableRealtimeForTable = async (tableName: string) => {
  try {
    // Verificar si la tabla existe
    const { data: tableExists, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', tableName)
      .eq('table_schema', 'public')
      .single();
      
    if (tableError || !tableExists) {
      console.error(`Table ${tableName} does not exist:`, tableError);
      return { success: false, error: `Table ${tableName} does not exist` };
    }
    
    // Asegurar que la tabla tenga REPLICA IDENTITY FULL
    const alterTableQuery = `ALTER TABLE public.${tableName} REPLICA IDENTITY FULL;`;
    const { error: alterError } = await supabase.rpc('execute_sql', { query: alterTableQuery });
    
    if (alterError) {
      console.error(`Error setting REPLICA IDENTITY FULL on ${tableName}:`, alterError);
      return { success: false, error: alterError.message };
    }
    
    // Añadir la tabla a la publicación de supabase_realtime
    const addToPublicationQuery = `
      INSERT INTO 
        pg_publication_tables (pubname, schemaname, tablename)
      VALUES 
        ('supabase_realtime', 'public', '${tableName}')
      ON CONFLICT DO NOTHING;
    `;
    
    const { error: pubError } = await supabase.rpc('execute_sql', { query: addToPublicationQuery });
    
    if (pubError) {
      console.error(`Error adding ${tableName} to supabase_realtime publication:`, pubError);
      return { success: false, error: pubError.message };
    }
    
    console.log(`Successfully enabled realtime for table ${tableName}`);
    return { success: true };
  } catch (error) {
    console.error(`Error enabling realtime for ${tableName}:`, error);
    return { success: false, error };
  }
};

/**
 * Crea un canal de suscripción para cambios en una tabla específica
 * @param tableName Nombre de la tabla a escuchar
 * @param event Tipo de evento ('INSERT', 'UPDATE', 'DELETE', '*')
 * @param callback Función a ejecutar cuando se reciba un evento
 * @param schema Esquema de la base de datos, por defecto 'public'
 * @returns El canal de suscripción
 */
export const createTableSubscription = (
  tableName: string, 
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*' = '*',
  callback: (payload: any) => void,
  schema: string = 'public'
) => {
  // Crear nombre único para el canal
  const channelName = `realtime:${tableName}:${event}:${Date.now()}`;
  
  // Crear el canal y suscribirse a los cambios
  const channel = supabase
    .channel(channelName)
    .on('postgres_changes', 
      {
        event,
        schema,
        table: tableName
      }, 
      (payload) => {
        console.log(`Realtime event received for ${tableName}:`, payload);
        callback(payload);
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`Successfully subscribed to changes on ${tableName}`);
      } else if (status === 'CHANNEL_ERROR') {
        console.error(`Error subscribing to changes on ${tableName}`);
        toast.error(`Error al conectar con tiempo real para ${tableName}`);
      }
    });
    
  return channel;
};

/**
 * Crea múltiples suscripciones a cambios en tablas
 * @param subscriptions Array de objetos con tablas y callbacks
 * @returns Array de canales creados
 */
export const createMultipleSubscriptions = (
  subscriptions: Array<{
    tableName: string;
    event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
    callback: (payload: any) => void;
    schema?: string;
  }>
) => {
  return subscriptions.map(sub => 
    createTableSubscription(
      sub.tableName,
      sub.event || '*',
      sub.callback,
      sub.schema || 'public'
    )
  );
};

/**
 * Limpia múltiples canales de suscripción
 * @param channels Array de canales a eliminar
 */
export const cleanupSubscriptions = (channels: any[]) => {
  channels.forEach(channel => {
    if (channel) {
      supabase.removeChannel(channel);
    }
  });
};
