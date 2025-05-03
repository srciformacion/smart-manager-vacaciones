
import { useState } from 'react';
import { Request, RequestType } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useOfflineRequests(userId: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  return {
    submitRequest,
    getPendingOfflineRequests,
    isSubmitting
  };
}
