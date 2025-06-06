import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/auth';
import { useWorkTimeConfig } from './use-work-time-config';
import { useLocationVerification } from './use-location-verification';

export interface WorkTimeRecord {
  id: string;
  user_id: string;
  date: string;
  clock_in_time: string | null;
  clock_out_time: string | null;
  break_start_time: string | null;
  break_end_time: string | null;
  lunch_start_time: string | null;
  lunch_end_time: string | null;
  permission_start_time: string | null;
  permission_end_time: string | null;
  total_worked_hours: number | null;
  notes: string | null;
  status: 'incomplete' | 'complete' | 'partial';
  created_at: string;
  updated_at: string;
}

export function useWorkTimeRecords(userId?: string) {
  const [records, setRecords] = useState<WorkTimeRecord[]>([]);
  const [todayRecord, setTodayRecord] = useState<WorkTimeRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const { config } = useWorkTimeConfig();
  const { verifyLocation, getUserIP } = useLocationVerification();

  const targetUserId = userId || user?.id;
  const today = new Date().toISOString().split('T')[0];

  const fetchRecords = async (startDate?: string, endDate?: string) => {
    if (!targetUserId) return;

    try {
      let query = supabase
        .from('work_time_records')
        .select('*')
        .eq('user_id', targetUserId)
        .order('date', { ascending: false });

      if (startDate) {
        query = query.gte('date', startDate);
      }
      if (endDate) {
        query = query.lte('date', endDate);
      }

      const { data, error } = await query;

      if (error) throw error;
      setRecords(data || []);

      // Find today's record
      const todayRec = data?.find(record => record.date === today);
      setTodayRecord(todayRec || null);
    } catch (error) {
      console.error('Error fetching work time records:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los registros de jornada"
      });
    } finally {
      setLoading(false);
    }
  };

  const clockIn = async (ambulance?: string) => {
    if (!targetUserId) return;

    try {
      // Verificar restricciones si están habilitadas
      let locationData = {};
      let ipData = {};

      if (config?.location_restriction_enabled) {
        try {
          const verification = await verifyLocation();
          if (!verification.isValid) {
            toast({
              variant: "destructive",
              title: "Ubicación no autorizada",
              description: "No puedes fichar desde esta ubicación. Debes estar dentro del área permitida."
            });
            return;
          }
          
          locationData = {
            clock_in_latitude: verification.userLocation?.latitude,
            clock_in_longitude: verification.userLocation?.longitude,
            location_verified: true
          };
        } catch (error) {
          if (config.require_location_permission) {
            toast({
              variant: "destructive",
              title: "Error de ubicación",
              description: "No se pudo verificar tu ubicación. Por favor, habilita los permisos de geolocalización."
            });
            return;
          }
          // Si no se requieren permisos, continuar sin verificación
          locationData = { location_verified: false };
        }
      }

      if (config?.ip_restriction_enabled) {
        try {
          const userIP = await getUserIP();
          // Aquí deberías verificar contra las IPs permitidas de las ubicaciones
          ipData = {
            clock_in_ip_address: userIP,
            ip_verified: true // Simplificado por ahora
          };
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Error de IP",
            description: "No se pudo verificar tu dirección IP."
          });
          return;
        }
      }

      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('work_time_records')
        .upsert({
          user_id: targetUserId,
          date: today,
          clock_in_time: now,
          status: 'incomplete',
          notes: ambulance || null,
          ...locationData,
          ...ipData
        }, {
          onConflict: 'user_id,date'
        })
        .select()
        .single();

      if (error) throw error;
      
      setTodayRecord(data);
      await fetchRecords();
      
      toast({
        title: "Entrada registrada",
        description: ambulance 
          ? `Has fichado correctamente la entrada en ${ambulance}`
          : "Has fichado correctamente la entrada"
      });
    } catch (error) {
      console.error('Error clocking in:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo registrar la entrada"
      });
    }
  };

  const changeAmbulance = async (newAmbulance: string) => {
    if (!todayRecord) return;

    try {
      const { data, error } = await supabase
        .from('work_time_records')
        .update({
          notes: newAmbulance
        })
        .eq('id', todayRecord.id)
        .select()
        .single();

      if (error) throw error;
      
      setTodayRecord(data);
      await fetchRecords();
      
      toast({
        title: "Ambulancia cambiada",
        description: `Has cambiado a la ambulancia ${newAmbulance}`
      });
    } catch (error) {
      console.error('Error changing ambulance:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo cambiar la ambulancia"
      });
    }
  };

  const clockOut = async () => {
    if (!todayRecord) return;

    try {
      // Verificar restricciones si están habilitadas (similar a clockIn)
      let locationData = {};
      let ipData = {};

      if (config?.location_restriction_enabled) {
        try {
          const verification = await verifyLocation();
          if (!verification.isValid) {
            toast({
              variant: "destructive",
              title: "Ubicación no autorizada",
              description: "No puedes fichar la salida desde esta ubicación."
            });
            return;
          }
          
          locationData = {
            clock_out_latitude: verification.userLocation?.latitude,
            clock_out_longitude: verification.userLocation?.longitude
          };
        } catch (error) {
          if (config.require_location_permission) {
            toast({
              variant: "destructive",
              title: "Error de ubicación",
              description: "No se pudo verificar tu ubicación para la salida."
            });
            return;
          }
        }
      }

      if (config?.ip_restriction_enabled) {
        try {
          const userIP = await getUserIP();
          ipData = {
            clock_out_ip_address: userIP
          };
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Error de IP",
            description: "No se pudo verificar tu dirección IP para la salida."
          });
          return;
        }
      }

      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('work_time_records')
        .update({
          clock_out_time: now,
          ...locationData,
          ...ipData
        })
        .eq('id', todayRecord.id)
        .select()
        .single();

      if (error) throw error;
      
      setTodayRecord(data);
      await fetchRecords();
      
      toast({
        title: "Salida registrada",
        description: "Has fichado correctamente la salida"
      });
    } catch (error) {
      console.error('Error clocking out:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo registrar la salida"
      });
    }
  };

  const startBreak = async () => {
    if (!todayRecord) return;

    try {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('work_time_records')
        .update({
          break_start_time: now
        })
        .eq('id', todayRecord.id)
        .select()
        .single();

      if (error) throw error;
      
      setTodayRecord(data);
      
      toast({
        title: "Descanso iniciado",
        description: "Has iniciado tu descanso"
      });
    } catch (error) {
      console.error('Error starting break:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo iniciar el descanso"
      });
    }
  };

  const endBreak = async () => {
    if (!todayRecord) return;

    try {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('work_time_records')
        .update({
          break_end_time: now
        })
        .eq('id', todayRecord.id)
        .select()
        .single();

      if (error) throw error;
      
      setTodayRecord(data);
      
      toast({
        title: "Descanso finalizado",
        description: "Has finalizado tu descanso"
      });
    } catch (error) {
      console.error('Error ending break:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo finalizar el descanso"
      });
    }
  };

  const startLunch = async () => {
    if (!todayRecord) return;

    try {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('work_time_records')
        .update({
          lunch_start_time: now
        })
        .eq('id', todayRecord.id)
        .select()
        .single();

      if (error) throw error;
      
      setTodayRecord(data);
      
      toast({
        title: "Almuerzo iniciado",
        description: "Has iniciado tu almuerzo"
      });
    } catch (error) {
      console.error('Error starting lunch:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo iniciar el almuerzo"
      });
    }
  };

  const endLunch = async () => {
    if (!todayRecord) return;

    try {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('work_time_records')
        .update({
          lunch_end_time: now
        })
        .eq('id', todayRecord.id)
        .select()
        .single();

      if (error) throw error;
      
      setTodayRecord(data);
      
      toast({
        title: "Almuerzo finalizado",
        description: "Has finalizado tu almuerzo"
      });
    } catch (error) {
      console.error('Error ending lunch:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo finalizar el almuerzo"
      });
    }
  };

  const startPermission = async () => {
    if (!todayRecord) return;

    try {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('work_time_records')
        .update({
          permission_start_time: now
        })
        .eq('id', todayRecord.id)
        .select()
        .single();

      if (error) throw error;
      
      setTodayRecord(data);
      
      toast({
        title: "Permiso iniciado",
        description: "Has iniciado tu permiso"
      });
    } catch (error) {
      console.error('Error starting permission:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo iniciar el permiso"
      });
    }
  };

  const endPermission = async () => {
    if (!todayRecord) return;

    try {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('work_time_records')
        .update({
          permission_end_time: now
        })
        .eq('id', todayRecord.id)
        .select()
        .single();

      if (error) throw error;
      
      setTodayRecord(data);
      
      toast({
        title: "Permiso finalizado",
        description: "Has regresado del permiso"
      });
    } catch (error) {
      console.error('Error ending permission:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo finalizar el permiso"
      });
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [targetUserId]);

  return {
    records,
    todayRecord,
    loading,
    clockIn,
    clockOut,
    startBreak,
    endBreak,
    startLunch,
    endLunch,
    startPermission,
    endPermission,
    changeAmbulance,
    fetchRecords
  };
}
