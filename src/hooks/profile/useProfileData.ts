
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Profile } from "@/components/profile/types";

export const useProfileData = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<Profile | null>(null);
  const [createMode, setCreateMode] = useState(false);

  const fetchProfile = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          setCreateMode(true);
          const initialForm = {
            id: userId,
            name: "",
            surname: "",
            email: "",
            dni: "",
            department: "",
            start_date: undefined,
          };
          setForm(initialForm);
          return { createMode: true, form: initialForm };
        } else {
          toast({ 
            variant: "destructive",
            title: "Error", 
            description: "No se pudo cargar el perfil." 
          });
          return { createMode: false, form: null };
        }
      }

      const profileWithDate = {
        ...profileData,
        start_date: profileData.start_date ? new Date(profileData.start_date) : undefined
      };
      setProfile(profileWithDate);
      setForm(profileWithDate);
      return { createMode: false, form: profileWithDate };
    } catch (error) {
      toast({ 
        variant: "destructive",
        title: "Error", 
        description: "Ocurrió un error al cargar el perfil." 
      });
      return { createMode: false, form: null };
    }
  };

  return {
    profile,
    form,
    createMode,
    setForm,
    setProfile,
    fetchProfile,
  };
};
