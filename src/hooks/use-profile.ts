
import { useState, useEffect } from "react";
import { useProfileAuth } from "./profile/useProfileAuth";
import { useProfileData } from "./profile/useProfileData";
import { useProfileForm } from "./profile/useProfileForm";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useProfile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const { userId, user, fetchAuthUser } = useProfileAuth();
  const { profile, form, createMode, setForm, setProfile, fetchProfile } = useProfileData();
  const { 
    edit, 
    saving, 
    setEdit, 
    handleSave, 
    handleChange, 
    handleCancel,
    handleProfilePhotoChange
  } = useProfileForm(userId, profile, setProfile, form, setForm);

  // Function to retry fetching profile
  const retryFetch = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
  };

  useEffect(() => {
    const initializeProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const authUser = await fetchAuthUser();
        
        if (authUser) {
          // Check if profile exists in Supabase
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();
            
          if (profileError && profileError.code !== 'PGRST116') {
            console.error("Error fetching profile:", profileError);
            setError("Error al cargar el perfil desde la base de datos.");
            setLoading(false);
            return;
          }
          
          // If profile exists in Supabase, use it
          if (profileData) {
            const profile = {
              id: profileData.id,
              name: profileData.name || "",
              surname: profileData.surname || "",
              email: profileData.email || "",
              dni: profileData.dni || "",
              department: profileData.department || "",
              start_date: profileData.start_date ? new Date(profileData.start_date) : undefined,
              profilePhoto: undefined, // Implementación de fotos vendrá después
              preferred_notification_channel: "web",
              notification_channels: [],
              notification_consent: false
            };
            
            setProfile(profile);
            setForm(profile);
            setLoading(false);
            return;
          }
          
          // If not, use local data or create new
          await fetchProfile(authUser.id);
        }
      } catch (err) {
        setError("No se pudo cargar el perfil. Por favor, intenta de nuevo más tarde.");
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeProfile();
  }, [retryCount]);

  return {
    edit,
    loading,
    form,
    saving,
    createMode,
    user,
    error,
    handleSave,
    handleCancel,
    handleChange,
    setEdit,
    retryFetch,
    handleProfilePhotoChange
  };
};
