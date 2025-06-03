
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Request, Balance } from "@/types";
import { validateVacationRequest, suggestAlternativeDates, calculateAvailableDays } from "@/utils/vacationLogic";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

export function useVacationRequest(user: User, requests: Request[], balance: Balance) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<{from: Date, to: Date}[]>([]);
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
    values: { 
      startDate: Date; 
      endDate: Date; 
      isPriority?: boolean; 
      notes?: string 
    },
    file: File | null
  ) => {
    setIsSubmitting(true);
    setValidationError(null);
    setSuggestions([]);

    if (!values.startDate || !values.endDate) {
      setValidationError("Por favor, seleccione las fechas de inicio y fin");
      setIsSubmitting(false);
      return;
    }

    const requestedDays = Math.floor(
      (values.endDate.getTime() - values.startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

    if (requestedDays > remainingDays) {
      setValidationError(`No dispone de suficientes días de vacaciones. Solicitados: ${requestedDays}, Disponibles: ${remainingDays}`);
      setIsSubmitting(false);
      return;
    }

    const validation = validateVacationRequest(
      values.startDate,
      values.endDate,
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
        values.startDate,
        values.endDate,
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
      // Create the request in Supabase - using lowercase column names
      const { data, error } = await supabase
        .from('requests')
        .insert({
          userid: user.id,
          type: 'vacation',
          startDate: values.startDate,
          endDate: values.endDate,
          reason: values.isPriority ? 'Prioritaria' : 'Normal',
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
      setTimeout(() => navigate("/requests"), 2000);
      
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
