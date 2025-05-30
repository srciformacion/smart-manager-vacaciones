
import { supabase } from '@/integrations/supabase/client';
import { Request } from '@/types';

export async function registerSyncTask(tag: string): Promise<boolean> {
  if (!('serviceWorker' in navigator) || !('SyncManager' in window)) {
    console.warn('Background Sync no está soportado en este navegador');
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
    localStorage.removeItem('pendingRequests');
    return { success: 0, errors: 0 };
  }
  
  if (!Array.isArray(pendingRequests) || pendingRequests.length === 0) {
    console.log('Parsed pendingRequests is empty or not an array.');
    return { success: 0, errors: 0 };
  }

  let successCount = 0;
  let errorCount = 0;
  const successfullySyncedIds: string[] = [];

  for (const request of pendingRequests) {
    try {
      const { id, createdAt, updatedAt, userId, ...requestDataToSubmit } = request; // Fixed: changed from userid to userId
      
      console.log('Attempting to sync request:', id, requestDataToSubmit);

      const { error } = await supabase
        .from('requests')
        .insert({
          ...requestDataToSubmit,
          userId: userId, // Fixed: changed from userid to userId
          status: 'pending'
        });
        
      if (error) {
        console.error('Supabase insert error for request:', id, error); // Fixed: changed from offlineId to id
        throw error;
      }
      
      console.log('Successfully synced request:', id); // Fixed: changed from offlineId to id
      successCount++;
      successfullySyncedIds.push(id); // Fixed: changed from offlineId to id
    } catch (error) {
      console.error('Error al sincronizar solicitud:', id, error); // Fixed: changed from offlineId to id
      errorCount++;
    }
  }

  if (pendingRequests.length > 0) {
    if (errorCount === 0 && successCount === pendingRequests.length) {
      console.log('All pending requests synced. Clearing localStorage.');
      localStorage.removeItem('pendingRequests');
    } else {
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
