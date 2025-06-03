
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface WorkTimeConfig {
  id: string;
  is_enabled: boolean;
  daily_hours_limit: number;
  weekly_hours_limit: number;
  alert_incomplete_workday: boolean;
  alert_missing_records: boolean;
  alert_overtime: boolean;
  location_restriction_enabled: boolean;
  ip_restriction_enabled: boolean;
  require_location_permission: boolean;
  created_at: string;
  updated_at: string;
}

export function useWorkTimeConfig() {
  const [config, setConfig] = useState<WorkTimeConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('work_time_module_config')
        .select('*')
        .single();

      if (error) throw error;
      setConfig(data);
    } catch (error) {
      console.error('Error fetching work time config:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo cargar la configuración del módulo"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (updates: Partial<WorkTimeConfig>) => {
    if (!config) return;

    try {
      const { data, error } = await supabase
        .from('work_time_module_config')
        .update(updates)
        .eq('id', config.id)
        .select()
        .single();

      if (error) throw error;
      
      setConfig(data);
      toast({
        title: "Éxito",
        description: "Configuración actualizada correctamente"
      });
    } catch (error) {
      console.error('Error updating work time config:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar la configuración"
      });
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return {
    config,
    loading,
    updateConfig,
    refetch: fetchConfig
  };
}
