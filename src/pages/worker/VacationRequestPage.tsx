import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/main-layout";
import { RequestForm } from "@/components/requests/request-form";
import { User, Request, WorkGroup, Balance } from "@/types";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { validateVacationRequest, suggestAlternativeDates, calculateAvailableDays, getVacationRules } from "@/utils/vacationLogic";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

const exampleRequests: Request[] = [
  {
    id: "req-1",
    userId: "1",
    type: "vacation",
    startDate: new Date("2025-08-01"),
    endDate: new Date("2025-08-07"),
    status: "approved",
    createdAt: new Date("2025-06-15"),
    updatedAt: new Date("2025-06-16"),
  },
];

const exampleBalance = {
  id: "bal-1",
  userId: "1",
  vacationDays: 22,
  personalDays: 3,
  leaveDays: 4,
  year: 2025,
};

export default function VacationRequestPage() {
  const [user] = useState<User>(exampleUser);
  const [requests] = useState<Request[]>(exampleRequests);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<DateRange[]>([]);
  const [success, setSuccess] = useState(false);
  const [balance, setBalance] = useState<Balance>(exampleBalance);
  const { toast } = useToast();
  
  const navigate = useNavigate();

  const availableBalance = calculateAvailableDays(user, balance);

  const usedVacationDays = requests.reduce((total, req) => {
    if (req.type === 'vacation' && (req.status === 'approved' || req.status === 'pending')) {
      const startDate = new Date(req.startDate);
      const endDate = new Date(req.endDate);
      const days = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return total + days;
    }
    return total;
  }, 0);

  const remainingDays = availableBalance.vacationDays - usedVacationDays;

  const handleSubmit = async (
    values: { dateRange: DateRange; reason?: string; notes?: string },
    file: File | null
  ) => {
    setIsSubmitting(true);
    setValidationError(null);
    setSuggestions([]);

    if (!values.dateRange?.from || !values.dateRange?.to) {
      setValidationError("Por favor, seleccione un rango de fechas válido");
      setIsSubmitting(false);
      return;
    }

    const requestedDays = Math.floor(
      (values.dateRange.to.getTime() - values.dateRange.from.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

    if (requestedDays > remainingDays) {
      setValidationError(`No dispone de suficientes días de vacaciones. Solicitados: ${requestedDays}, Disponibles: ${remainingDays}`);
      setIsSubmitting(false);
      return;
    }

    const validation = validateVacationRequest(
      values.dateRange.from,
      values.dateRange.to,
      user,
      requests
    );

    if (!validation.valid) {
      setValidationError(validation.message);
      toast({
        variant: "destructive",
        title: "Error de validación",
        description: validation.message
      });
      
      const alternatives = suggestAlternativeDates(
        values.dateRange.from,
        values.dateRange.to,
        user,
        requests
      );
      
      if (alternatives.length > 0) {
        setSuggestions(
          alternatives.map(([from, to]) => ({ from, to }))
        );
      }
      
      setIsSubmitting(false);
      return;
    }

    try {
      toast({
        title: "Solicitud enviada",
        description: "Tu solicitud de vacaciones ha sido registrada exitosamente."
      });
      
      setSuccess(true);
      setTimeout(() => navigate("/historial"), 2000);
      
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

  const applySuggestion = (suggestion: DateRange) => {
    setValidationError(null);
    setSuggestions([]);
    
    handleSubmit(
      {
        dateRange: suggestion,
      },
      null
    );
  };

  return (
    <MainLayout user={user}>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Solicitud de vacaciones</h1>
        </div>

        <div className="px-4 py-3 bg-primary/10 rounded-lg">
          <p className="text-sm">
            <strong>Tu grupo de trabajo:</strong> {user.workGroup}
          </p>
          <p className="text-sm">
            <strong>Regla vacacional:</strong>{" "}
            {getVacationRules(user.workGroup as WorkGroup)}
          </p>
          <p className="text-sm">
            <strong>Días disponibles:</strong> {remainingDays} de {availableBalance.vacationDays} días 
            {user.seniority > 0 && (
              <span className="text-xs"> (incluye {Math.floor(user.seniority / 5)} días adicionales por antigüedad)</span>
            )}
          </p>
        </div>

        {validationError && (
          <Alert variant="destructive">
            <AlertTitle>Error de validación</AlertTitle>
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        )}

        {suggestions.length > 0 && (
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 space-y-3">
            <h3 className="font-medium">Fechas alternativas sugeridas:</h3>
            <div className="grid gap-2 md:grid-cols-3">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="text-xs justify-start font-normal"
                  onClick={() => applySuggestion(suggestion)}
                >
                  {format(suggestion.from!, "PPP", { locale: es })} -{" "}
                  {format(suggestion.to!, "PPP", { locale: es })}
                </Button>
              ))}
            </div>
          </div>
        )}

        {success ? (
          <Alert className="bg-success/10 border-success/30">
            <AlertTitle>Solicitud enviada correctamente</AlertTitle>
            <AlertDescription>
              Su solicitud de vacaciones ha sido registrada y está pendiente de aprobación.
            </AlertDescription>
          </Alert>
        ) : (
          <RequestForm
            requestType="vacation"
            user={user}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </MainLayout>
  );
}
