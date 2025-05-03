
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RequestType, User, ShiftProfile } from "@/types";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formSchema, FormValues } from "./form/request-form-schema";
import { DateRangeSection } from "./form/date-range-section";
import { TimeSelectionSection } from "./form/time-selection-section";
import { ReplacementSection } from "./form/replacement-section";
import { RequestDetailsSection } from "./form/request-details-section";
import { FileUploadSection } from "./form/file-upload-section";
import { getVacationRules } from "@/utils/vacationLogic";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RequestFormProps {
  requestType: RequestType;
  user: User;
  availableUsers?: User[];
  shiftProfiles?: ShiftProfile[];
  onSubmit: (values: FormValues, file: File | null) => void;
  isSubmitting?: boolean;
}

export function RequestForm({
  requestType,
  user,
  availableUsers = [],
  shiftProfiles = [],
  onSubmit,
  isSubmitting = false,
}: RequestFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [showTimeSelectors] = useState(requestType === 'personalDay');
  const [localIsSubmitting, setLocalIsSubmitting] = useState(false);
  const [profiles, setProfiles] = useState<ShiftProfile[]>(shiftProfiles);
  
  const defaultProfile = profiles.find(profile => profile.isDefault);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateRange: {
        from: new Date(),
        to: new Date(),
      },
      reason: "",
      notes: "",
      shiftProfileId: defaultProfile?.id || "",
      startTime: defaultProfile?.startTime || "08:00",
      endTime: defaultProfile?.endTime || "15:00",
    },
  });

  // Cargar perfiles de turno desde Supabase
  useEffect(() => {
    const loadShiftProfiles = async () => {
      try {
        const { data, error } = await supabase
          .from('calendar_templates')
          .select('*');
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Transformar los datos al formato de ShiftProfile
          const profilesData = data.map(template => ({
            id: template.id,
            name: template.name,
            startTime: "08:00", // Valores por defecto si no se especifican en el template
            endTime: "15:00",
            isDefault: template.is_default || false
          }));
          
          setProfiles(profilesData);
        }
      } catch (error) {
        console.error("Error al cargar perfiles de turno:", error);
      }
    };
    
    loadShiftProfiles();
  }, []);

  const getRequestTypeTitle = () => {
    switch (requestType) {
      case "vacation":
        return "Solicitud de vacaciones";
      case "personalDay":
        return "Solicitud de asuntos propios";
      case "leave":
        return "Solicitud de permiso justificado";
      case "shiftChange":
        return "Solicitud de cambio de turno";
      default:
        return "Nueva solicitud";
    }
  };

  const getRequestTypeDescription = () => {
    switch (requestType) {
      case "vacation":
        const rules = getVacationRules(user.workGroup);
        return `Grupo de trabajo: ${user.workGroup}. ${rules}`;
      case "personalDay":
        return "Solicitud de días por asuntos propios. Los días pueden solicitarse en bloques de 8h, 12h o 24h según su turno.";
      case "leave":
        return "Solicitud de permiso justificado con documento acreditativo.";
      case "shiftChange":
        return "Solicitud de cambio de turno con otro compañero. Debe especificar la fecha de devolución.";
      default:
        return "";
    }
  };

  const handleSubmit = async (values: FormValues) => {
    setLocalIsSubmitting(true);
    
    try {
      let attachmentUrl = null;
      
      // Si hay un archivo para subir (en caso de permisos justificados)
      if (file && requestType === 'leave') {
        const filename = `${user.id}/${Date.now()}_${file.name}`;
        
        // Verificar si el bucket existe
        const { data: bucketData, error: bucketError } = await supabase
          .storage
          .getBucket('attachments');
        
        // Si no existe el bucket, intentar crearlo
        if (bucketError && bucketError.message.includes('does not exist')) {
          await supabase.storage.createBucket('attachments', { public: true });
        }
        
        // Subir el archivo
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('attachments')
          .upload(filename, file);
          
        if (uploadError) throw uploadError;
        
        // Obtener la URL pública
        const { data: urlData } = supabase
          .storage
          .from('attachments')
          .getPublicUrl(filename);
          
        attachmentUrl = urlData.publicUrl;
      }
      
      // Preparar datos para insertar en la tabla requests
      const requestData = {
        userid: user.id,
        type: requestType,
        startdate: values.dateRange.from,
        enddate: values.dateRange.to || values.dateRange.from,
        starttime: values.startTime,
        endtime: values.endTime,
        reason: values.reason,
        notes: values.notes,
        attachmenturl: attachmentUrl,
        status: 'pending'
      };
      
      // Insertar la solicitud en Supabase
      const { data, error } = await supabase
        .from('requests')
        .insert(requestData)
        .select();
        
      if (error) throw error;
      
      // Llamar a la función onSubmit original
      onSubmit(values, file);
      
      toast.success(`Solicitud de ${getRequestTypeTitle().toLowerCase()} enviada correctamente`);
    } catch (error) {
      console.error("Error al enviar solicitud:", error);
      toast.error("Error al enviar la solicitud. Por favor, inténtelo de nuevo.");
    } finally {
      setLocalIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{getRequestTypeTitle()}</CardTitle>
        <CardDescription>{getRequestTypeDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <DateRangeSection form={form} user={user} isSubmitting={isSubmitting || localIsSubmitting} />

            {showTimeSelectors && (
              <TimeSelectionSection form={form} isSubmitting={isSubmitting || localIsSubmitting} />
            )}

            {requestType === 'shiftChange' && availableUsers.length > 0 && (
              <ReplacementSection 
                form={form} 
                user={user} 
                availableUsers={availableUsers} 
                isSubmitting={isSubmitting || localIsSubmitting} 
              />
            )}

            <RequestDetailsSection 
              form={form} 
              requestType={requestType}
              isSubmitting={isSubmitting || localIsSubmitting} 
            />

            {requestType === "leave" && (
              <FileUploadSection
                onFileChange={setFile}
                isSubmitting={isSubmitting || localIsSubmitting}
              />
            )}

            <Button type="submit" disabled={isSubmitting || localIsSubmitting} className="w-full">
              {isSubmitting || localIsSubmitting ? "Enviando..." : "Enviar solicitud"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
