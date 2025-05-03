
import { useState, useEffect } from "react";
import { Profile } from "@/components/profile/types";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useProfileData = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<Profile | null>(null);
  const [createMode, setCreateMode] = useState(false);

  const fetchProfile = async (userId: string) => {
    try {
      // Try to get profile from Supabase
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching profile from Supabase:", error);
      }

      if (profileData) {
        // User exists in database
        const userProfile: Profile = {
          id: profileData.id,
          name: profileData.name || "",
          surname: profileData.surname || "",
          email: profileData.email || "",
          dni: profileData.dni || "",
          department: profileData.department || "",
          start_date: profileData.start_date ? new Date(profileData.start_date) : undefined,
          profilePhoto: undefined, // Photo implementation coming later
          preferred_notification_channel: "web",
          notification_channels: [],
          notification_consent: false
        };
        
        setProfile(userProfile);
        setForm(userProfile);
        setCreateMode(false);
        return;
      }
      
      // If we don't have profile data from Supabase, check localStorage
      const localProfile = localStorage.getItem(`profile-${userId}`);
      
      if (localProfile) {
        const profileData = JSON.parse(localProfile);
        const storedDate = profileData.start_date 
          ? new Date(profileData.start_date) 
          : undefined;
          
        const userProfile: Profile = {
          ...profileData,
          start_date: storedDate
        };
        
        setProfile(userProfile);
        setForm(userProfile);
        setCreateMode(false);
        return;
      }
      
      // Create an empty profile if none exists
      const newProfile: Profile = {
        id: userId,
        name: "",
        surname: "",
        email: "",
        dni: "",
        department: "",
        preferred_notification_channel: "web",
        notification_channels: [],
        notification_consent: false
      };
      
      setProfile(newProfile);
      setForm(newProfile);
      setCreateMode(true);
      
    } catch (err) {
      console.error("Error loading profile:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo cargar el perfil. Por favor, intenta de nuevo más tarde."
      });
    }
  };

  return {
    profile,
    form,
    createMode,
    setForm,
    setProfile,
    fetchProfile
  };
};
