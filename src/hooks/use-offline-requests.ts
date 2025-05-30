import { useState, useEffect } from 'react';
import { Request, RequestType } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { registerSyncTask, syncPendingRequests as backgroundSyncRequests } from '@/utils/background-sync';

export function useOfflineRequests(userId: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState(navigator.onLine);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setOnlineStatus(true);
      toast.success('Conexión restablecida');
      
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready.then(registration => {
          registration.sync.register('sync-pending-requests')
            .then(() => console.log('Background sync registered from hook on online'))
            .catch(error => {
                console.error('Error registering sync from hook:', error);
                syncPendingRequests();
            });
        });
      } else {
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
      if (navigator.onLine) {
        const { data, error } = await supabase
          .from('requests')
          .insert({
            ...requestData,
            userId: userId, // Fixed: changed from userid to userId
            status: 'pending'
          })
          .select()
          .single();

        if (error) throw error;

        toast.success('Solicitud enviada correctamente');
        return { success: true, data, isOffline: false };
      } else {
        const offlineRequest: Request = {
          ...requestData,
          userId: userId, // Fixed: changed from userid to userId
          status: 'pending',
          id: `offline-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const pendingString = localStorage.getItem('pendingRequests');
        const pendingRequests = pendingString ? JSON.parse(pendingString) : [];

        pendingRequests.push(offlineRequest);
        localStorage.setItem('pendingRequests', JSON.stringify(pendingRequests));

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
      return allPending.filter((req: any) => req.userId === userId) // Fixed: changed from userid to userId
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

  const syncPendingRequests = async (): Promise<void> => { 
    console.log('Attempting manual sync from useOfflineRequests hook');
    const { success, errors } = await backgroundSyncRequests();
    
    if (success > 0) {
      toast.success(`${success} solicitud(es) sincronizada(s) correctamente desde el hook`);
    }
    
    if (errors > 0) {
      toast.error(`No se pudieron sincronizar ${errors} solicitud(es) desde el hook`);
    }
  };

  return {
    submitRequest,
    getPendingOfflineRequests,
    syncPendingRequests,
    isSubmitting,
    isOnline: onlineStatus
  };
}
