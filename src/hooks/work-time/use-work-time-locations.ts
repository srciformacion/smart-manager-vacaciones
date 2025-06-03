
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface WorkTimeLocation {
  id: string;
  name: string;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  radius_meters: number;
  allowed_ip_addresses: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useWorkTimeLocations() {
  const [locations, setLocations] = useState<WorkTimeLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('work_time_locations')
        .select('*')
        .order('name');

      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error('Error fetching work time locations:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar las ubicaciones"
      });
    } finally {
      setLoading(false);
    }
  };

  const createLocation = async (location: Omit<WorkTimeLocation, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('work_time_locations')
        .insert([location])
        .select()
        .single();

      if (error) throw error;
      
      setLocations(prev => [...prev, data]);
      toast({
        title: "Éxito",
        description: "Ubicación creada correctamente"
      });
      
      return data;
    } catch (error) {
      console.error('Error creating location:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear la ubicación"
      });
      throw error;
    }
  };

  const updateLocation = async (id: string, updates: Partial<WorkTimeLocation>) => {
    try {
      const { data, error } = await supabase
        .from('work_time_locations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setLocations(prev => prev.map(loc => loc.id === id ? data : loc));
      toast({
        title: "Éxito",
        description: "Ubicación actualizada correctamente"
      });
    } catch (error) {
      console.error('Error updating location:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar la ubicación"
      });
    }
  };

  const deleteLocation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('work_time_locations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setLocations(prev => prev.filter(loc => loc.id !== id));
      toast({
        title: "Éxito",
        description: "Ubicación eliminada correctamente"
      });
    } catch (error) {
      console.error('Error deleting location:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar la ubicación"
      });
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  return {
    locations,
    loading,
    createLocation,
    updateLocation,
    deleteLocation,
    refetch: fetchLocations
  };
}
