
import { supabase } from '@/integrations/supabase/client';

/**
 * Activa la funcionalidad de tiempo real para una tabla específica
 * @param tableName Nombre de la tabla
 * @returns Un objeto con información sobre la operación
 */
export const enableRealtimeForTable = async (tableName: string) => {
  try {
    // 1. Establecer REPLICA IDENTITY FULL para la tabla
    const { error: replicaError } = await supabase.rpc(
      'execute_sql',
      { 
        query: `ALTER TABLE ${tableName} REPLICA IDENTITY FULL;` 
      }
    );
    
    if (replicaError) throw replicaError;
    
    // 2. Añadir la tabla a la publicación de supabase_realtime
    const { error: publicationError } = await supabase.rpc(
      'execute_sql',
      { 
        query: `
          ALTER PUBLICATION supabase_realtime 
          ADD TABLE ${tableName};
        ` 
      }
    );
    
    if (publicationError) throw publicationError;
    
    return { success: true, message: `Tiempo real activado para ${tableName}` };
  } catch (error: any) {
    console.error('Error al habilitar tiempo real:', error);
    return { 
      success: false, 
      error: error.message || 'Error desconocido al habilitar tiempo real' 
    };
  }
};
