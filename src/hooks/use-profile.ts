
import { useState, useEffect } from "react";
import { useProfileAuth } from "./profile/useProfileAuth";
import { useProfileData } from "./profile/useProfileData";
import { useProfileForm } from "./profile/useProfileForm";

export const useProfile = () => {
  const [loading, setLoading] = useState(true);
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
        const authUser = await fetchAuthUser();
        if (authUser) {
          await fetchProfile(authUser.id);
        }
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
    handleSave,
    handleCancel,
    handleChange,
    setEdit
  };
};
