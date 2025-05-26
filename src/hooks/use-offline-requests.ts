
import { useState, useEffect } from 'react';
import { Request, RequestType } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { registerSyncTask, syncPendingRequests as backgroundSyncRequests } from '@/utils/background-sync'; // Renamed import to avoid conflict

export function useOfflineRequests(userId: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState(navigator.onLine);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setOnlineStatus(true);
      toast.success('Conexión restablecida');
      
      // Intentar sincronizar solicitudes pendientes cuando se recupera la conexión
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready.then(registration => {
          registration.sync.register('sync-pending-requests')
            .then(() => console.log('Background sync registered from hook on online'))
            .catch(error => {
                console.error('Error registering sync from hook:', error);
                // Fallback si el registro de sync falla, intentar sincronización manual
                syncPendingRequests();
            });
        });
      } else {
        // Fallback para navegadores sin soporte de Background Sync
        console.log('Background Sync not supported, attempting manual sync from hook');
        syncPendingRequests();
      }
    };
    
    const handleOffline = () => {
      setOnlineStatus(false);
      toast.error('Conexión perdida');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const submitRequest = async (requestData: Omit<Request, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    setIsSubmitting(true);

    try {
      // Comprobar si estamos online
      if (navigator.onLine) {
        // Modo online: enviar directamente a Supabase
        const { data, error } = await supabase
          .from('requests')
          .insert({
            ...requestData,
            userid: userId,
            status: 'pending'
          })
          .select()
          .single();

        if (error) throw error;

        toast.success('Solicitud enviada correctamente');
        return { success: true, data, isOffline: false };
      } else {
        // Modo offline: guardar en localStorage
        const offlineRequest: Request = { // Ensure type matches Request
          ...requestData,
          userid: userId, // Supabase maps this to 'userid' column
          status: 'pending',
          id: `offline-${Date.now()}`, // ID temporal
          createdAt: new Date(), // Use Date object, will be stringified by JSON
          updatedAt: new Date(), // Use Date object
        };

        // Obtener solicitudes pendientes existentes
        const pendingString = localStorage.getItem('pendingRequests');
        const pendingRequests = pendingString ? JSON.parse(pendingString) : [];

        // Añadir nueva solicitud
        pendingRequests.push(offlineRequest);

        // Guardar en localStorage
        localStorage.setItem('pendingRequests', JSON.stringify(pendingRequests));

        // Registrar tarea de sincronización en segundo plano
        const syncRegistered = await registerSyncTask('sync-pending-requests');
        if (syncRegistered) {
            toast.success('Solicitud guardada. Se sincronizará al recuperar conexión.');
        } else {
            toast.info('Solicitud guardada localmente. Intenta sincronizar manualmente más tarde.');
        }
        
        return { success: true, data: offlineRequest, isOffline: true };
      }
    } catch (error: any) {
      console.error('Error al enviar solicitud:', error);
      toast.error(`Error: ${error.message}`);
      return { success: false, error: error.message, isOffline: !navigator.onLine };
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPendingOfflineRequests = (): Request[] => {
    try {
      const pendingString = localStorage.getItem('pendingRequests');
      if (!pendingString) return [];

      const allPending = JSON.parse(pendingString);
      // Filtrar por userId para obtener solo las del usuario actual
      // Also ensure dates are parsed back into Date objects if needed, though for submission they are often ISO strings
      return allPending.filter((req: any) => req.userid === userId)
        .map((req: any) => ({
            ...req,
            startDate: new Date(req.startDate),
            endDate: new Date(req.endDate),
            createdAt: new Date(req.createdAt),
            updatedAt: new Date(req.updatedAt),
        }));
    } catch (error) {
      console.error('Error al obtener solicitudes pendientes:', error);
      return [];
    }
  };

  // Renamed this function to avoid conflict with the imported one
  const syncPendingRequests = async (): Promise<void> => { 
    console.log('Attempting manual sync from useOfflineRequests hook');
    const { success, errors } = await backgroundSyncRequests(); // Call the utility function
    
    if (success > 0) {
      toast.success(`${success} solicitud(es) sincronizada(s) correctamente desde el hook`);
    }
    
    if (errors > 0) {
      toast.error(`No se pudieron sincronizar ${errors} solicitud(es) desde el hook`);
    }
    // The backgroundSyncRequests function handles removing/updating localStorage
  };

  return {
    submitRequest,
    getPendingOfflineRequests,
    syncPendingRequests, // Expose this potentially manual sync trigger
    isSubmitting,
    isOnline: onlineStatus
  };
}

