
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateRangeSection } from "./form/date-range-section";
import { TimeSelectionSection } from "./form/time-selection-section";
import { RequestDetailsSection } from "./form/request-details-section";
import { FileUploadSection } from "./form/file-upload-section";
import { User, RequestType } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requestFormSchema, RequestFormValues } from "./form/request-form-schema";
import { ShiftProfile } from '@/types/calendar';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RequestFormProps {
  user: User;
  requestType: RequestType;
  isLeaveForm?: boolean;
  onSubmit: (data: any, file?: File | null) => void;
  isSubmitting?: boolean;
}

export function RequestForm({ 
  user, 
  requestType, 
  isLeaveForm = false,
  onSubmit,
  isSubmitting = false
}: RequestFormProps) {
  const [shiftProfiles, setShiftProfiles] = useState<ShiftProfile[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(isSubmitting);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    // Cargar perfiles de turno desde Supabase
    const loadShiftProfiles = async () => {
      try {
        const { data, error } = await supabase
          .from('shift_profiles')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          const mappedProfiles: ShiftProfile[] = data.map(profile => ({
            id: profile.id,
            name: profile.name,
            startTime: profile.start_time || '08:00',
            endTime: profile.end_time || '16:00',
            isDefault: profile.is_default,
            userId: profile.user_id,
            shiftType: profile.shift_type,
            workDays: profile.work_days,
            createdBy: profile.created_by,
            createdAt: new Date(profile.created_at),
            updatedAt: new Date(profile.updated_at)
          }));
          
          setShiftProfiles(mappedProfiles);
        }
      } catch (error) {
        console.error('Error cargando perfiles de turno:', error);
      }
    };
    
    loadShiftProfiles();
  }, [user.id]);

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      reason: "",
      notes: "",
    },
  });

  const handleSubmit = async (values: RequestFormValues) => {
    setSubmitting(true);
    
    try {
      // Preparar datos para la base de datos
      const requestData = {
        userid: user.id,
        type: requestType,
        startdate: values.dateRange.from,
        enddate: values.dateRange.to || values.dateRange.from,
        starttime: values.startTime,
        endtime: values.endTime,
        reason: values.reason,
        notes: values.notes,
        status: 'pending'
      };
      
      // Insertar en la tabla requests
      const { data, error } = await supabase
        .from('requests')
        .insert(requestData)
        .select();
        
      if (error) throw error;
      
      toast.success(`Solicitud de ${getRequestTypeName(requestType)} enviada correctamente`);
      onSubmit(values, selectedFile);
    } catch (error) {
      console.error('Error al enviar solicitud:', error);
      toast.error('Error al enviar la solicitud. Por favor, inténtelo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const getRequestTypeName = (type: RequestType): string => {
    switch (type) {
      case 'vacation': return 'vacaciones';
      case 'personalDay': return 'día personal';
      case 'leave': return 'permiso';
      case 'shiftChange': return 'cambio de turno';
      default: return type;
    }
  };

  const getTitle = (): string => {
    switch (requestType) {
      case 'vacation': return 'Solicitud de vacaciones';
      case 'personalDay': return 'Solicitud de día personal';
      case 'leave': return 'Solicitud de permiso';
      case 'shiftChange': return 'Solicitud de cambio de turno';
      default: return 'Solicitud';
    }
  };

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{getTitle()}</CardTitle>
        <CardDescription>
          Complete los detalles para enviar su solicitud
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <DateRangeSection 
              form={form} 
              user={user} 
              requestType={requestType}
              isSubmitting={submitting || isSubmitting} 
            />
            
            {isLeaveForm && (
              <TimeSelectionSection 
                form={form} 
                shiftProfiles={shiftProfiles}
                isSubmitting={submitting || isSubmitting} 
              />
            )}
            
            <RequestDetailsSection 
              form={form} 
              requestType={requestType}
              isSubmitting={submitting || isSubmitting} 
            />
            
            {requestType === 'leave' && (
              <FileUploadSection 
                onFileChange={handleFileChange}
                isSubmitting={submitting || isSubmitting} 
              />
            )}

            <Button type="submit" disabled={submitting || isSubmitting} className="w-full">
              {submitting || isSubmitting ? "Enviando..." : "Enviar solicitud"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
