
import { useState, useEffect } from 'react';
import { Request, RequestType } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { registerSyncTask } from '@/utils/background-sync';

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
            .catch(error => console.error('Error registering sync:', error));
        });
      } else {
        // Fallback para navegadores sin soporte de Background Sync
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
        const offlineRequest = {
          ...requestData,
          userid: userId,
          status: 'pending',
          id: `offline-${Date.now()}`, // ID temporal
          createdat: new Date().toISOString(),
          updatedat: new Date().toISOString()
        };

        // Obtener solicitudes pendientes existentes
        const pendingString = localStorage.getItem('pendingRequests');
        const pendingRequests = pendingString ? JSON.parse(pendingString) : [];

        // Añadir nueva solicitud
        pendingRequests.push(offlineRequest);

        // Guardar en localStorage
        localStorage.setItem('pendingRequests', JSON.stringify(pendingRequests));

        // Registrar tarea de sincronización en segundo plano
        await registerSyncTask('sync-pending-requests');
        
        toast.success('Solicitud guardada para enviar cuando vuelvas a estar online');
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
      return allPending.filter((req: any) => req.userid === userId);
    } catch (error) {
      console.error('Error al obtener solicitudes pendientes:', error);
      return [];
    }
  };

  const syncPendingRequests = async (): Promise<void> => {
    const pendingRequests = getPendingOfflineRequests();
    
    if (pendingRequests.length === 0) return;
    
    let syncedCount = 0;
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
        syncedCount++;
      } catch (error) {
        console.error('Error al sincronizar solicitud:', error);
        errorCount++;
      }
    }
    
    if (syncedCount > 0) {
      // Limpiar solicitudes sincronizadas
      const updatedPendingRequests = localStorage.getItem('pendingRequests') 
        ? JSON.parse(localStorage.getItem('pendingRequests') || '[]')
        : [];
      
      // Filtrar solicitudes de otros usuarios que no debemos eliminar
      const otherUserRequests = updatedPendingRequests.filter(
        (req: any) => req.userid !== userId
      );
      
      localStorage.setItem('pendingRequests', JSON.stringify(otherUserRequests));
      
      toast.success(`${syncedCount} solicitud(es) sincronizada(s) correctamente`);
    }
    
    if (errorCount > 0) {
      toast.error(`No se pudieron sincronizar ${errorCount} solicitud(es)`);
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
