
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { RequestForm } from '@/components/requests/request-form';
import { exampleUser } from '@/data/example-users';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useProfileAuth } from '@/hooks/profile/useProfileAuth';
import { supabase } from '@/integrations/supabase/client';
import { Balance } from '@/types';

export default function PersonalDayRequestPage() {
  const { user } = useProfileAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<Balance | null>(null);
  
  useEffect(() => {
    const fetchBalance = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('balances')
          .select('*')
          .eq('userId', user.id)
          .eq('year', new Date().getFullYear())
          .single();
          
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        
        if (data) {
          setBalance(data);
        }
        
      } catch (error) {
        console.error('Error fetching balance:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBalance();
  }, [user]);

  const handleSubmit = async (values: any, file: File | null) => {
    if (!user) return;
    
    try {
      // Calculate the number of days requested
      const startDate = values.dateRange.from;
      const endDate = values.dateRange.to;
      
      // Create the request in the database
      const { data, error } = await supabase
        .from('requests')
        .insert({
          userId: user.id,
          type: 'personalDay',
          startDate,
          endDate,
          startTime: values.startTime,
          endTime: values.endTime,
          reason: values.reason,
          notes: values.notes,
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Solicitud enviada",
        description: "Tu solicitud de día personal ha sido registrada exitosamente."
      });
      
      // Redirect to history page
      setTimeout(() => navigate("/historial"), 2000);
      
    } catch (error) {
      console.error("Error al crear solicitud:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo enviar la solicitud. Por favor, intenta de nuevo."
      });
    }
  };

  return (
    <MainLayout user={user || exampleUser}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Solicitud de días por asuntos propios</h1>
          <p className="text-muted-foreground mt-2">
            Complete el formulario para solicitar días por asuntos propios
          </p>
          {!loading && balance && (
            <p className="mt-2 font-medium">
              Días disponibles: <span className="text-primary">{balance.personalDays}</span>
            </p>
          )}
        </div>
        
        <RequestForm 
          requestType="personalDay"
          user={user || exampleUser}
          onSubmit={handleSubmit}
          isSubmitting={loading}
        />
      </div>
    </MainLayout>
  );
}
