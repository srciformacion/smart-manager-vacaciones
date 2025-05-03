
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
      const { data, error } = await supabase
        .from('requests')
        .insert({
          userid: userId,
          type: 'correction',
          startdate: date.toISOString().split('T')[0],
          enddate: date.toISOString().split('T')[0],
          reason: reason,
          status: 'pending'
        })
        .select();
        
      if (error) {
        throw error;
      }
      
      // Actualizar el turno como "excepción" en la tabla de calendar_shifts
      const { error: shiftError } = await supabase
        .from('calendar_shifts')
        .update({
          is_exception: true,
          exception_reason: reason
        })
        .eq('user_id', userId)
        .eq('date', date.toISOString().split('T')[0]);
        
      if (shiftError) {
        console.error("Error updating shift:", shiftError);
      }
      
      // Reiniciar el formulario
      setDate(undefined);
      setReason("");
      
      // Mostrar mensaje de éxito
      toast.success("Solicitud de corrección enviada correctamente");
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
      </CardContent>
    </Card>
  );
}
