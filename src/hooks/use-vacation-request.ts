
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DateRange } from "react-day-picker";
import { User, Request, Balance } from "@/types";
import { validateVacationRequest, suggestAlternativeDates, calculateAvailableDays } from "@/utils/vacationLogic";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

export function useVacationRequest(user: User, requests: Request[], balance: Balance) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<DateRange[]>([]);
  const [success, setSuccess] = useState(false);
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
        setSuggestions(alternatives.map(([from, to]) => ({ from, to })));
      }
      
      setIsSubmitting(false);
      return;
    }

    try {
      // Create the request in Supabase
      const { data, error } = await supabase
        .from('requests')
        .insert({
          userId: user.id,
          type: 'vacation',
          startDate: values.dateRange.from,
          endDate: values.dateRange.to,
          reason: values.reason || '',
          notes: values.notes || '',
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .select();
        
      if (error) throw error;
      
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

  return {
    isSubmitting,
    validationError,
    suggestions,
    success,
    remainingDays,
    availableBalance,
    handleSubmit,
    setSuggestions,
    setValidationError
  };
}
