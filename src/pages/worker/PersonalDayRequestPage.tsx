
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/main-layout";
import { RequestForm } from "@/components/requests/request-form";
import { User, Request } from "@/types";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft } from "lucide-react";
import { validatePersonalDayRequest, calculateAvailableDays } from "@/utils/vacationLogic";
import { useToast } from "@/hooks/use-toast";

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

// Datos de ejemplo para otros usuarios
const exampleUsers: User[] = [
  // ... mismo departamento que el usuario actual
  {
    id: "2",
    name: "Luis García",
    email: "luis.garcia@empresa.com",
    role: "worker",
    shift: "Programado",
    workGroup: "Grupo Programado",
    workday: "Completa",
    department: "Atención al cliente",
    seniority: 5,
  },
  {
    id: "3",
    name: "Elena Sánchez",
    email: "elena.sanchez@empresa.com",
    role: "worker",
    shift: "Urgente 24h",
    workGroup: "Urgente 24h",
    workday: "Completa",
    department: "Atención al cliente",
    seniority: 7,
  },
];

// Ejemplo de solicitudes existentes
const exampleRequests: Request[] = [
  {
    id: "req-1",
    userId: "2", // Luis García
    type: "personalDay",
    startDate: new Date("2025-05-15"),
    endDate: new Date("2025-05-15"),
    status: "approved",
    createdAt: new Date("2025-04-15"),
    updatedAt: new Date("2025-04-16"),
  },
];

// Ejemplo de balance de días
const exampleBalance = {
  id: "bal-1",
  userId: "1", // Ana Martínez
  vacationDays: 22,
  personalDays: 3,
  leaveDays: 4,
  year: 2025,
};

export default function PersonalDayRequestPage() {
  const [user] = useState<User>(exampleUser);
  const [users] = useState<User[]>([exampleUser, ...exampleUsers]);
  const [requests] = useState<Request[]>(exampleRequests);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [balance, setBalance] = useState(exampleBalance);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Calcular días disponibles según antigüedad
  const availableBalance = calculateAvailableDays(user, balance);

  const handleSubmit = async (
    values: { dateRange: DateRange; reason?: string; notes?: string },
    file: File | null
  ) => {
    setIsSubmitting(true);
    setError(null);

    // Verificar que hay fechas válidas
    if (!values.dateRange?.from || !values.dateRange?.to) {
      setError("Por favor, seleccione un día para su solicitud");
      setIsSubmitting(false);
      return;
    }
    
    // Verificar que es un solo día (para asuntos propios)
    const startDate = values.dateRange.from;
    const endDate = values.dateRange.to;
    const diffInDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    if (diffInDays > 1) {
      setError("Los asuntos propios deben solicitarse por días individuales");
      setIsSubmitting(false);
      return;
    }
    
    // Verificar que quedan días disponibles
    if (availableBalance.personalDays <= 0) {
      setError("No dispone de días de asuntos propios restantes para este año");
      setIsSubmitting(false);
      return;
    }
    
    // Validar según reglas (10% del personal)
    const validation = validatePersonalDayRequest(
      startDate,
      user,
      requests,
      users
    );
    
    if (!validation.valid) {
      setError(validation.message);
      toast({
        variant: "destructive",
        title: "Error de validación",
        description: validation.message
      });
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
      toast({
        title: "Solicitud enviada",
        description: "Tu solicitud de asuntos propios ha sido registrada exitosamente."
      });
      
      setSuccess(true);
      
      // Redirigir después de un tiempo
      setTimeout(() => {
        navigate("/historial");
      }, 2000);
      
    } catch (error) {
      console.error("Error al crear solicitud:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo enviar la solicitud. Por favor, intenta de nuevo."
      });
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
            <br />
            <strong>Días disponibles:</strong> {availableBalance.personalDays} días.
            {user.seniority >= 25 && (
              <span className="block text-xs mt-1">(Incluye 2 días adicionales por antigüedad superior a 25 años)</span>
            )}
            {user.seniority >= 15 && user.seniority < 25 && (
              <span className="block text-xs mt-1">(Incluye 1 día adicional por antigüedad superior a 15 años)</span>
            )}
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
