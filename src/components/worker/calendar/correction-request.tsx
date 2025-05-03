
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CorrectionRequestProps {
  userId?: string;
}

export function CorrectionRequest({ userId }: CorrectionRequestProps) {
  const [date, setDate] = useState<Date>();
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [recentRequests, setRecentRequests] = useState<any[]>([]);

  // Cargar solicitudes recientes al montar el componente
  useEffect(() => {
    const loadRecentRequests = async () => {
      if (!userId) return;
      
      try {
        const { data, error } = await supabase
          .from('requests')
          .select('*')
          .eq('userid', userId)
          .eq('type', 'correction')
          .order('createdat', { ascending: false })
          .limit(5);
          
        if (error) throw error;
        
        if (data) {
          setRecentRequests(data);
        }
      } catch (error) {
        console.error("Error loading recent correction requests:", error);
      }
    };
    
    loadRecentRequests();
    
    // Configurar canal para escuchar cambios en tiempo real
    const channel = supabase
      .channel('correction-requests-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'requests',
          filter: `userid=eq.${userId} AND type=eq.correction`
        }, 
        (payload) => {
          console.log('Cambio detectado en solicitudes:', payload);
          loadRecentRequests();
        }
      )
      .subscribe();
      
    // Limpiar suscripción al desmontar
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      toast.error("Por favor selecciona una fecha");
      return;
    }
    
    if (!reason.trim()) {
      toast.error("Por favor ingresa el motivo de la corrección");
      return;
    }
    
    if (!userId) {
      toast.error("Debes iniciar sesión para enviar solicitudes");
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Crear una solicitud de corrección en Supabase
      const requestData = {
        userid: userId,
        type: 'correction',
        startdate: date.toISOString().split('T')[0],
        enddate: date.toISOString().split('T')[0],
        reason: reason,
        status: 'pending',
        createdat: new Date().toISOString(),
        updatedat: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('requests')
        .insert(requestData)
        .select();
        
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        // Actualizar el turno como "excepción" en la tabla de calendar_shifts
        const shiftData = {
          is_exception: true,
          exception_reason: reason,
          updated_at: new Date().toISOString()
        };
        
        const { error: shiftError } = await supabase
          .from('calendar_shifts')
          .update(shiftData)
          .eq('user_id', userId)
          .eq('date', date.toISOString().split('T')[0]);
          
        if (shiftError) {
          console.error("Error updating shift:", shiftError);
          // Continuamos aunque haya error en la actualización del turno
        }
        
        // Crear una notificación para RRHH
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: '00000000-0000-0000-0000-000000000000', // ID ficticio para RRHH
            title: "Nueva solicitud de corrección de turno",
            message: `Se ha recibido una solicitud de corrección para el día ${date.toLocaleDateString()}`,
            type: "correction",
            created_at: new Date().toISOString()
          });
        
        if (notificationError) {
          console.error("Error creating notification:", notificationError);
        }
        
        // Reiniciar el formulario
        setDate(undefined);
        setReason("");
        
        // Mostrar mensaje de éxito
        toast.success("Solicitud de corrección enviada correctamente");
      }
    } catch (error: any) {
      console.error("Error submitting correction request:", error);
      toast.error(`Error al enviar la solicitud: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicitar corrección de turno</CardTitle>
        <CardDescription>
          Si encuentras alguna inconsistencia en tu calendario, puedes solicitar una corrección.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Fecha a corregir</Label>
            <DatePicker 
              date={date} 
              onSelect={setDate}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Motivo de la corrección</Label>
            <Textarea 
              id="reason"
              placeholder="Describe detalladamente el error en el turno..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
          <div className="pt-2">
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Enviando..." : "Enviar solicitud"}
            </Button>
          </div>
        </form>
        
        {recentRequests.length > 0 && (
          <div className="mt-6 border-t pt-4">
            <h4 className="text-sm font-medium mb-2">Solicitudes recientes</h4>
            <div className="space-y-3">
              {recentRequests.map((req) => (
                <div key={req.id} className="text-sm border rounded-md p-2">
                  <div className="flex justify-between">
                    <span className="font-medium">
                      {new Date(req.startdate).toLocaleDateString()}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      req.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {req.status === 'pending' ? 'Pendiente' : 
                       req.status === 'approved' ? 'Aprobada' : 'Rechazada'}
                    </span>
                  </div>
                  <p className="mt-1 text-gray-600 line-clamp-2">{req.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
