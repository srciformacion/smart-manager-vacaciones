
import { useState, useEffect } from "react";
import { useProfileAuth } from "./profile/useProfileAuth";
import { useProfileData } from "./profile/useProfileData";
import { useProfileForm } from "./profile/useProfileForm";
import { toast } from "@/components/ui/use-toast";

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
