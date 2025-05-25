
/**
 * Utilidad para manejar la sincronización en segundo plano de solicitudes pendientes
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Registra una tarea de sincronización en segundo plano
 * @param tag Identificador de la tarea de sincronización
 */
export async function registerSyncTask(tag: string): Promise<boolean> {
  if (!('serviceWorker' in navigator) || !('SyncManager' in window)) {
    console.log('Background Sync no está soportado en este navegador');
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.sync.register(tag);
    console.log(`Tarea de sincronización "${tag}" registrada correctamente`);
    return true;
  } catch (error) {
    console.error('Error al registrar tarea de sincronización:', error);
    return false;
  }
}

/**
 * Sincroniza todas las solicitudes pendientes con el servidor
 */
export async function syncPendingRequests(): Promise<{ success: number; errors: number }> {
  const pendingString = localStorage.getItem('pendingRequests');
  if (!pendingString) return { success: 0, errors: 0 };

  const pendingRequests = JSON.parse(pendingString);
  let successCount = 0;
  let errorCount = 0;

  for (const request of pendingRequests) {
    try {
      // Eliminar propiedades que no necesitamos enviar
      const { id, createdat, updatedat, ...requestData } = request;
      
      // Enviar a Supabase
      const { error } = await supabase
        .from('requests')
        .insert({
          ...requestData,
          status: 'pending'
        });
        
      if (error) throw error;
      successCount++;
    } catch (error) {
      console.error('Error al sincronizar solicitud:', error);
      errorCount++;
    }
  }

  if (successCount > 0) {
    // Si todas las solicitudes se sincronizaron correctamente, limpiar localStorage
    if (errorCount === 0) {
      localStorage.removeItem('pendingRequests');
    } else {
      // De lo contrario, eliminar solo las solicitudes sincronizadas correctamente
      const remainingRequests = pendingRequests.slice(successCount);
      localStorage.setItem('pendingRequests', JSON.stringify(remainingRequests));
    }
  }

  return { success: successCount, errors: errorCount };
}
