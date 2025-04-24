
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/main-layout";
import { RequestForm } from "@/components/requests/request-form";
import { User, Request, Balance } from "@/types";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft } from "lucide-react";
import { VacationBalanceInfo } from "@/components/vacation/vacation-balance-info";
import { VacationSuggestions } from "@/components/vacation/vacation-suggestions";
import { useVacationRequest } from "@/hooks/use-vacation-request";

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
  const [balance] = useState<Balance>(exampleBalance);
  const navigate = useNavigate();

  const {
    isSubmitting,
    validationError,
    suggestions,
    success,
    remainingDays,
    availableBalance,
    handleSubmit,
    setSuggestions,
    setValidationError
  } = useVacationRequest(user, requests, balance);

  const applySuggestion = (suggestion: DateRange) => {
    setValidationError(null);
    setSuggestions([]);
    handleSubmit({ dateRange: suggestion }, null);
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

        <VacationBalanceInfo
          user={user}
          remainingDays={remainingDays}
          totalDays={availableBalance.vacationDays}
        />

        {validationError && (
          <Alert variant="destructive">
            <AlertTitle>Error de validación</AlertTitle>
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        )}

        <VacationSuggestions
          suggestions={suggestions}
          onSelectSuggestion={applySuggestion}
        />

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
