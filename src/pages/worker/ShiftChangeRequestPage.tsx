import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/main-layout";
import { ShiftChangeForm } from "@/components/requests/shift-change-form";
import { User, Request } from "@/types";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft } from "lucide-react";
import { validateShiftChangeRequest } from "@/utils/vacation/validation";
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
  department: "Centro Coordinador Programado",
  seniority: 3,
};

// Datos de ejemplo para compañeros de trabajo
const exampleCoworkers: User[] = [
  {
    id: "2",
    name: "Luis García",
    email: "luis.garcia@empresa.com",
    role: "worker",
    shift: "Programado",
    workGroup: "Grupo Programado",
    workday: "Completa",
    department: "Centro Coordinador Programado",
    seniority: 5,
  },
  {
    id: "3",
    name: "Carmen Rodríguez",
    email: "carmen.rodriguez@empresa.com",
    role: "worker",
    shift: "Programado",
    workGroup: "Grupo Programado",
    workday: "Completa",
    department: "Centro Coordinador Programado",
    seniority: 7,
  },
];

export default function ShiftChangeRequestPage() {
  const [user] = useState<User>(exampleUser);
  const [coworkers] = useState<User[]>(exampleCoworkers);
  const [requests] = useState<Request[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  
  const navigate = useNavigate();

  const handleSubmit = async (
    values: {
      date: Date;
      replacementUserId: string;
      reason?: string;
      returnDate?: Date;
    }
  ) => {
    setIsSubmitting(true);
    setValidationError(null);

    // Verificar que hay fecha válida y usuario de reemplazo
    if (!values.date || !values.replacementUserId) {
      setValidationError("Por favor, complete todos los campos obligatorios");
      toast({
        variant: "destructive",
        title: "Error de validación",
        description: "Por favor, complete todos los campos obligatorios"
      });
      setIsSubmitting(false);
      return;
    }

    // Encontrar el usuario de reemplazo
    const replacement = coworkers.find(c => c.id === values.replacementUserId);
    if (!replacement) {
      setValidationError("Usuario de reemplazo no encontrado");
      toast({
        variant: "destructive",
        title: "Error de validación",
        description: "Usuario de reemplazo no encontrado"
      });
      setIsSubmitting(false);
      return;
    }

    // Validar según reglas
    const validation = validateShiftChangeRequest(
      values.date,
      values.returnDate || values.date,
      user,
      replacement,
      requests
    );

    if (!validation.valid) {
      setValidationError(validation.message);
      toast({
        variant: "destructive",
        title: "Error de validación",
        description: validation.message
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // En una implementación real, enviaríamos a base de datos
      // const newRequest = {
      //   userId: user.id,
      //   type: "shiftChange",
      //   startDate: values.date,
      //   endDate: values.date,
      //   replacementUserId: values.replacementUserId,
      //   returnDate: values.returnDate,
      //   reason: values.reason || "",
      //   status: "pending",
      // };
      // await NocoDBAPI.createRequest(newRequest);

      // Simular una petición
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mostrar mensaje de éxito
      toast({
        title: "Solicitud enviada",
        description: "Tu solicitud de cambio de turno ha sido registrada exitosamente."
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
          <h1 className="text-3xl font-bold tracking-tight">Solicitud de cambio de turno</h1>
        </div>

        <div className="px-4 py-3 bg-primary/10 rounded-lg">
          <p className="text-sm">
            Los cambios de turno deben ser con compañeros de función equivalente y respetar el descanso mínimo legal.
            Debe existir un compromiso de devolución del turno dentro del mismo año natural.
          </p>
        </div>

        {validationError && (
          <Alert variant="destructive">
            <AlertTitle>Error de validación</AlertTitle>
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        )}

        {success ? (
          <Alert className="bg-success/10 border-success/30">
            <AlertTitle>Solicitud enviada correctamente</AlertTitle>
            <AlertDescription>
              Su solicitud de cambio de turno ha sido registrada y está pendiente de aprobación.
            </AlertDescription>
          </Alert>
        ) : (
          <ShiftChangeForm
            user={user}
            coworkers={coworkers}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </MainLayout>
  );
}
