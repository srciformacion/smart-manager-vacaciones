
import React, { useState, useEffect } from 'react';
import { MainLayout } from "@/components/layout/main-layout";
import { UserWelcome } from "@/components/user/UserWelcome";
import { useProfileAuth } from "@/hooks/profile/useProfileAuth";
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function WelcomePage() {
  const { user, fetchAuthUser } = useProfileAuth();
  const [balanceData, setBalanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Refetch user data to ensure we have the latest
        await fetchAuthUser();
        
        if (user?.id) {
          // Try to fetch balance data from Supabase
          const { data: balanceData, error: balanceError } = await supabase
            .from('balances')
            .select('vacation_days, personal_days, leave_days')
            .eq('user_id', user.id)
            .single();
            
          if (balanceError && balanceError.code !== 'PGRST116') {
            console.error("Error fetching balance data:", balanceError);
          }
          
          if (balanceData) {
            setBalanceData({
              vacationDays: balanceData.vacation_days || 0,
              personalDays: balanceData.personal_days || 0,
              leaveDays: balanceData.leave_days || 0
            });
          } else {
            // Do not set default values for new users
            setBalanceData(null);
          }
        }
      } catch (error) {
        console.error("Error loading user welcome data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user?.id]);
  
  const handleContinue = () => {
    const userRole = user?.role || localStorage.getItem('userRole') || 'worker';
    
    // Navigate based on user role
    if (userRole === 'hr') {
      navigate('/rrhh/dashboard');
    } else {
      navigate('/dashboard');
    }
    
    toast({
      title: "¡Bienvenido/a!",
      description: "Accede a todas las funciones desde el menú lateral."
    });
  };
  
  return (
    <MainLayout user={user}>
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <UserWelcome 
          user={user} 
          balanceData={balanceData} 
          isLoading={loading} 
        />
        
        <div className="flex justify-center mt-8">
          <Button 
            size="lg"
            onClick={handleContinue}
            className="gap-2"
          >
            Continuar <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
