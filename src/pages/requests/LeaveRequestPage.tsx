
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { RequestForm } from '@/components/requests/request-form';
import { exampleUser } from '@/data/example-users';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useProfileAuth } from '@/hooks/profile/useProfileAuth';
import { supabase } from '@/integrations/supabase/client';
import { Balance } from '@/types';

export default function LeaveRequestPage() {
  const { user } = useProfileAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
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
      setUploading(true);
      
      // Upload file if provided
      let attachmentUrl = null;
      if (file) {
        const filename = `${user.id}/${Date.now()}_${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('attachments')
          .upload(filename, file);
          
        if (uploadError) throw uploadError;
        
        // Get public URL
        attachmentUrl = `${supabase.supabaseUrl}/storage/v1/object/public/attachments/${filename}`;
      }
      
      // Create the request in the database
      const { data, error } = await supabase
        .from('requests')
        .insert({
          userId: user.id,
          type: 'leave',
          startDate: values.dateRange.from,
          endDate: values.dateRange.to,
          reason: values.reason,
          notes: values.notes,
          status: 'pending',
          attachmentUrl,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Solicitud enviada",
        description: "Tu solicitud de permiso ha sido registrada exitosamente."
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
    } finally {
      setUploading(false);
    }
  };

  return (
    <MainLayout user={user || exampleUser}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Solicitud de permisos</h1>
          <p className="text-muted-foreground mt-2">
            Complete el formulario para solicitar un permiso especial
          </p>
          {!loading && balance && (
            <p className="mt-2 font-medium">
              Días disponibles: <span className="text-primary">{balance.leaveDays}</span>
            </p>
          )}
        </div>
        
        <RequestForm 
          requestType="leave"
          user={user || exampleUser}
          onSubmit={handleSubmit}
          isSubmitting={loading || uploading}
        />
      </div>
    </MainLayout>
  );
}
