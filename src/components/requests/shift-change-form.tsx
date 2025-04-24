
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DateSection } from "./form/date-section";
import { ReplacementSection } from "./form/replacement-section";
import { RequestDetailsSection } from "./form/request-details-section";
import { formSchema, FormValues } from "./form/request-form-schema";

interface ShiftChangeFormProps {
  user: User;
  coworkers: User[];
  onSubmit: (values: FormValues) => void;
  isSubmitting?: boolean;
}

export function ShiftChangeForm({
  user,
  coworkers,
  onSubmit,
  isSubmitting = false,
}: ShiftChangeFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: "",
      notes: "",
    },
  });

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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DateSection 
              form={form} 
              user={user} 
              isSubmitting={isSubmitting} 
            />
            
            <ReplacementSection 
              form={form} 
              user={user} 
              availableUsers={coworkers} 
              isSubmitting={isSubmitting} 
            />
            
            <RequestDetailsSection 
              form={form} 
              requestType="shiftChange"
              isSubmitting={isSubmitting} 
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Enviando..." : "Enviar solicitud"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
