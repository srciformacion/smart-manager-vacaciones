
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/main-layout";
import { RequestForm } from "@/components/requests/request-form";
import { User, Request } from "@/types";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft } from "lucide-react";

// Datos de ejemplo para demostración
const exampleUser: User = {
  id: "1",
  name: "Ana Martínez",
  email: "ana.martinez@empresa.com",
  role: "worker",
  shift: "Programado",
  workGroup: "Grupo Programado",
  workday: "Completa",
  department: "Atención al cliente",
  seniority: 3,
};

export default function PersonalDayRequestPage() {
  const [user] = useState<User>(exampleUser);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (
    values: { dateRange: DateRange; reason?: string; notes?: string },
    file: File | null
  ) => {
    setIsSubmitting(true);
    setError(null);

    // Verificar que hay fechas válidas
    if (!values.dateRange?.from || !values.dateRange?.to) {
      setError("Por favor, seleccione un rango de fechas válido");
      setIsSubmitting(false);
      return;
    }

    try {
      // En una implementación real, enviaríamos a NocoDB
      // const newRequest = {
      //   userId: user.id,
      //   type: "personalDay",
      //   startDate: values.dateRange.from,
      //   endDate: values.dateRange.to,
      //   reason: values.reason || "",
      //   notes: values.notes || "",
      //   status: "pending",
      // };
      // await NocoDBAPI.createRequest(newRequest);

      // Simular una petición
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mostrar mensaje de éxito
      setSuccess(true);
      
      // Redirigir después de un tiempo
      setTimeout(() => {
        navigate("/historial");
      }, 2000);
      
    } catch (error) {
      console.error("Error al crear solicitud:", error);
      setError("Error al enviar la solicitud. Inténtelo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout user={user}>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Solicitud de asuntos propios</h1>
        </div>

        <div className="px-4 py-3 bg-primary/10 rounded-lg">
          <p className="text-sm">
            Los días de asuntos propios son un derecho reconocido para atender necesidades personales.
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success ? (
          <Alert className="bg-success/10 border-success/30">
            <AlertTitle>Solicitud enviada correctamente</AlertTitle>
            <AlertDescription>
              Su solicitud de asuntos propios ha sido registrada y está pendiente de aprobación.
            </AlertDescription>
          </Alert>
        ) : (
          <RequestForm
            requestType="personalDay"
            user={user}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </MainLayout>
  );
}
