/**
 * Utilidad para manejar la sincronización en segundo plano de solicitudes pendientes
 */

import { supabase } from '@/integrations/supabase/client';
import { Request } from '@/types'; // Import Request type

/**
 * Registra una tarea de sincronización en segundo plano
 * @param tag Identificador de la tarea de sincronización
 */
export async function registerSyncTask(tag: string): Promise<boolean> {
  if (!('serviceWorker' in navigator) || !('SyncManager' in window)) {
    console.warn('Background Sync no está soportado en este navegador');
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    // Now TypeScript knows about registration.sync due to global.d.ts
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
 * Esta función es llamada por el Service Worker o manualmente.
 */
export async function syncPendingRequests(): Promise<{ success: number; errors: number }> {
  console.log('syncPendingRequests called from background-sync.ts');
  const pendingString = localStorage.getItem('pendingRequests');
  if (!pendingString) {
    console.log('No pending requests in localStorage.');
    return { success: 0, errors: 0 };
  }

  let pendingRequests: Request[];
  try {
    pendingRequests = JSON.parse(pendingString);
  } catch (e) {
    console.error("Error parsing pendingRequests from localStorage", e);
    localStorage.removeItem('pendingRequests'); // Clear corrupted data
    return { success: 0, errors: 0 };
  }
  
  if (!Array.isArray(pendingRequests) || pendingRequests.length === 0) {
    console.log('Parsed pendingRequests is empty or not an array.');
    return { success: 0, errors: 0 };
  }

  let successCount = 0;
  let errorCount = 0;
  const successfullySyncedIds: string[] = [];
  const requestsToKeep: Request[] = [];

  for (const request of pendingRequests) {
    try {
      // Destructure with correct casing: createdAt, updatedAt
      // id is an offline ID, not to be sent to Supabase directly if it's auto-generated there
      const { id: offlineId, createdAt, updatedAt, userid, ...requestDataToSubmit } = request;
      
      console.log('Attempting to sync request:', offlineId, requestDataToSubmit);

      // Enviar a Supabase
      const { error } = await supabase
        .from('requests')
        .insert({
          ...requestDataToSubmit,
          userid: userid, // Ensure userid is passed
          status: 'pending' // Or whatever status is appropriate
        });
        
      if (error) {
        console.error('Supabase insert error for request:', offlineId, error);
        throw error;
      }
      
      console.log('Successfully synced request:', offlineId);
      successCount++;
      successfullySyncedIds.push(offlineId);
    } catch (error) {
      console.error('Error al sincronizar solicitud:', offlineId, error);
      errorCount++;
      // Add request to keep if it failed
      requestsToKeep.push(request);
    }
  }

  if (pendingRequests.length > 0) {
    if (errorCount === 0 && successCount === pendingRequests.length) {
      // All requests synced successfully
      console.log('All pending requests synced. Clearing localStorage.');
      localStorage.removeItem('pendingRequests');
    } else {
      // Some errors, or partial success. Update localStorage with remaining/failed requests.
      const remainingRequests = pendingRequests.filter(req => !successfullySyncedIds.includes(req.id));
      if (remainingRequests.length > 0) {
        console.log(`Updating localStorage with ${remainingRequests.length} remaining requests.`);
        localStorage.setItem('pendingRequests', JSON.stringify(remainingRequests));
      } else {
        console.log('All processed requests either succeeded or failed and were accounted for. Clearing localStorage as no distinct remaining.');
        localStorage.removeItem('pendingRequests');
      }
    }
  }
  
  console.log(`Sync finished. Success: ${successCount}, Errors: ${errorCount}`);
  return { success: successCount, errors: errorCount };
}
