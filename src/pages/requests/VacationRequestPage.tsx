
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { RequestForm } from '@/components/requests/request-form';
import { exampleUser } from '@/data/example-users';
import { exampleRequests } from '@/data/example-requests';
import { useVacationRequest } from '@/hooks/use-vacation-request';
import { Balance } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useProfileAuth } from '@/hooks/profile/useProfileAuth';
import { supabase } from '@/integrations/supabase/client';

export default function VacationRequestPage() {
  const { user } = useProfileAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState(exampleRequests);
  const [balance, setBalance] = useState<Balance>({
    id: '1',
    userId: user?.id || '',
    vacationDays: 22,
    personalDays: 6,
    leaveDays: 5,
    year: new Date().getFullYear()
  });
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Fetch user's previous requests
        const { data: userRequests, error: requestsError } = await supabase
          .from('requests')
          .select('*')
          .eq('userId', user.id);
          
        if (requestsError) throw requestsError;
        
        if (userRequests) {
          setRequests(userRequests.map(req => ({
            ...req,
            startDate: new Date(req.startDate),
            endDate: new Date(req.endDate),
            createdAt: new Date(req.createdAt),
            updatedAt: new Date(req.updatedAt)
          })));
        }
        
        // Fetch user's balance
        const { data: balanceData, error: balanceError } = await supabase
          .from('balances')
          .select('*')
          .eq('userId', user.id)
          .eq('year', new Date().getFullYear())
          .single();
          
        if (balanceError && balanceError.code !== 'PGRST116') {
          throw balanceError;
        }
        
        if (balanceData) {
          setBalance(balanceData);
        } else {
          // If no balance record exists, let's create a default one
          const defaultBalance = {
            userId: user.id,
            vacationDays: 22,
            personalDays: 6,
            leaveDays: 5,
            year: new Date().getFullYear()
          };
          
          const { data: newBalance, error: insertError } = await supabase
            .from('balances')
            .insert(defaultBalance)
            .select();
            
          if (insertError) {
            console.error('Error creating default balance:', insertError);
          } else if (newBalance && newBalance.length > 0) {
            setBalance(newBalance[0]);
          }
        }
        
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          variant: "destructive",
          title: "Error al cargar datos",
          description: "No se pudieron cargar sus datos. Inténtelo de nuevo más tarde."
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);

  const { 
    handleSubmit, 
    isSubmitting, 
    validationError,
    suggestions,
    remainingDays,
    availableBalance
  } = useVacationRequest(user || exampleUser, requests, balance);
  
  if (!user) {
    return null;
  }

  return (
    <MainLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Solicitud de vacaciones</h1>
          <p className="text-muted-foreground mt-2">
            Complete el formulario para solicitar sus días de vacaciones
          </p>
          {!loading && (
            <p className="mt-2 font-medium">
              Días disponibles: <span className="text-primary">{remainingDays}</span> de {availableBalance.vacationDays} totales
            </p>
          )}
        </div>
        
        <RequestForm 
          requestType="vacation"
          user={user || exampleUser}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting || loading}
        />
        
        {validationError && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md">
            <p className="font-medium">{validationError}</p>
          </div>
        )}
        
        {suggestions && suggestions.length > 0 && (
          <div className="bg-muted p-4 rounded-md">
            <h3 className="font-medium mb-2">Fechas alternativas sugeridas:</h3>
            <ul className="list-disc pl-5">
              {suggestions.map((range, i) => (
                <li key={i}>
                  {range.from?.toLocaleDateString()} - {range.to?.toLocaleDateString()}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
