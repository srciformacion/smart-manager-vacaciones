
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RequestType, User, ShiftProfile } from "@/types";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FileUpload } from "@/components/ui/file-upload";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formSchema, FormValues } from "./form/request-form-schema";
import { DateRangeSection } from "./form/date-range-section";
import { TimeSelectionSection } from "./form/time-selection-section";
import { ReplacementSection } from "./form/replacement-section";
import { RequestDetailsSection } from "./form/request-details-section";

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
  
  const defaultProfile = shiftProfiles.find(profile => profile.isDefault);
  
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

  const selectedProfileId = form.watch("shiftProfileId");
  
  useEffect(() => {
    if (selectedProfileId) {
      const selectedProfile = shiftProfiles.find(profile => profile.id === selectedProfileId);
      if (selectedProfile) {
        form.setValue("startTime", selectedProfile.startTime);
        form.setValue("endTime", selectedProfile.endTime);
      }
    }
  }, [selectedProfileId, shiftProfiles, form]);

  const handleSubmit = (values: FormValues) => {
    onSubmit(values, file);
  };

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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{getRequestTypeTitle()}</CardTitle>
        <CardDescription>{getRequestTypeDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <DateRangeSection form={form} user={user} isSubmitting={isSubmitting} />

            {showTimeSelectors && (
              <TimeSelectionSection form={form} isSubmitting={isSubmitting} />
            )}

            {requestType === 'shiftChange' && availableUsers.length > 0 && (
              <ReplacementSection 
                form={form} 
                user={user} 
                availableUsers={availableUsers} 
                isSubmitting={isSubmitting} 
              />
            )}

            <RequestDetailsSection 
              form={form} 
              requestType={requestType} 
              isSubmitting={isSubmitting} 
            />

            {requestType === "leave" && (
              <FormItem>
                <FormLabel>Justificante</FormLabel>
                <FormControl>
                  <FileUpload
                    onFileChange={setFile}
                    disabled={isSubmitting}
                    buttonText="Subir justificante"
                    placeholder="Seleccione un archivo"
                  />
                </FormControl>
                <FormDescription>
                  Suba un documento justificativo (PDF, imagen)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Enviando..." : "Enviar solicitud"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

