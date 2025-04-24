
import { useState, useEffect } from "react";
import { useProfileAuth } from "./profile/useProfileAuth";
import { useProfileData } from "./profile/useProfileData";
import { useProfileForm } from "./profile/useProfileForm";

export const useProfile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { userId, user, fetchAuthUser } = useProfileAuth();
  const { profile, form, createMode, setForm, setProfile, fetchProfile } = useProfileData();
  const { 
    edit, 
    saving, 
    setEdit, 
    handleSave, 
    handleChange, 
    handleCancel 
  } = useProfileForm(userId, profile, setProfile, form, setForm);

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
  }, []);

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
    setEdit
  };
};

