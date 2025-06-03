
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DateSection } from "./form/date-section";
import { ReplacementSection } from "./form/replacement-section";
import { RequestDetailsSection } from "./form/request-details-section";
import { requestFormSchema, RequestFormValues } from "./form/request-form-schema";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ShiftChangeFormProps {
  user: User;
  coworkers: User[];
  onSubmit: (values: RequestFormValues) => void;
  isSubmitting?: boolean;
}

export function ShiftChangeForm({
  user,
  coworkers,
  onSubmit,
  isSubmitting = false,
}: ShiftChangeFormProps) {
  const [availableCoworkers, setAvailableCoworkers] = useState<User[]>(coworkers);
  const [submitting, setSubmitting] = useState<boolean>(isSubmitting);

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      notes: "",
    },
  });

  // Cargar los trabajadores disponibles desde Supabase
  useEffect(() => {
    const loadCoworkers = async () => {
      try {
        // Obtener todos los perfiles excepto el del usuario actual
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', user.id);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Transformamos los datos de la BD al formato que espera la UI
          const mappedCoworkers: User[] = data.map(profile => ({
            id: profile.id,
            name: profile.name || '',
            email: profile.email || '',
            role: 'worker' as UserRole, // Cast to UserRole type
            department: profile.department || '',
            // Añadir campos requeridos por la interfaz User
            shift: 'Programado',
            workGroup: 'Grupo Programado',
            workday: 'Completa',
            seniority: 1
          }));
          
          setAvailableCoworkers(mappedCoworkers);
        }
      } catch (error) {
        console.error("Error al cargar compañeros:", error);
        // Si hay error, usamos los datos de ejemplo proporcionados
      }
    };
    
    loadCoworkers();
  }, [user.id]);

  const handleFormSubmit = async (values: RequestFormValues) => {
    setSubmitting(true);
    
    try {
      // Preparar datos para insertar en la tabla requests
      const payload = {
        userid: user.id,
        type: 'shiftChange',
        startdate: values.startDate,
        enddate: values.endDate || values.startDate,
        notes: values.notes,
        status: 'pending'
      };
      
      // Insertar la solicitud en Supabase
      const { data, error: requestError } = await supabase
        .from('requests')
        .insert(payload)
        .select();
      
      if (requestError) throw requestError;
      
      if (data && data.length > 0) {
        // Insertar el cambio de turno asociado
        const shiftChangeData = {
          request_id: data[0].id,
          original_user_id: user.id,
          replacement_user_id: values.replacementUserId,
          original_date: values.startDate,
          return_date: values.endDate
        };
        
        const { error: shiftChangeError } = await supabase
          .from('shift_changes')
          .insert(shiftChangeData);
        
        if (shiftChangeError) throw shiftChangeError;
        
        // Notificar al usuario de reemplazo
        if (values.replacementUserId) {
          const { error: notificationError } = await supabase
            .from('notifications')
            .insert({
              user_id: values.replacementUserId,
              title: "Nueva solicitud de cambio de turno",
              message: `${user.name} ha solicitado un cambio de turno contigo para el día ${new Date(values.startDate || new Date()).toLocaleDateString()}`,
              type: "shiftChange"
            });
          
          if (notificationError) console.error("Error al enviar notificación:", notificationError);
        }
        
        // Llamar a la función onSubmit original
        onSubmit(values);
        
        toast.success("Solicitud de cambio de turno enviada correctamente");
      }
    } catch (error) {
      console.error("Error al enviar solicitud:", error);
      toast.error("Error al enviar la solicitud. Por favor, inténtelo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Solicitud de cambio de turno</CardTitle>
        <CardDescription>
          Complete los datos para solicitar un cambio de turno con un compañero
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <DateSection 
              form={form} 
              user={user} 
              isSubmitting={submitting || isSubmitting} 
            />
            
            <ReplacementSection 
              form={form} 
              user={user} 
              availableUsers={availableCoworkers} 
              isSubmitting={submitting || isSubmitting} 
            />
            
            <RequestDetailsSection 
              form={form} 
              requestType="shiftChange"
              isSubmitting={submitting || isSubmitting} 
            />

            <Button type="submit" disabled={submitting || isSubmitting} className="w-full">
              {submitting || isSubmitting ? "Enviando..." : "Enviar solicitud"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
