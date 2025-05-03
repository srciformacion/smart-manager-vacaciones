
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Profile } from "@/components/profile/types";
import { NotificationChannel } from "@/types";

export const useProfileData = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<Profile | null>(null);
  const [createMode, setCreateMode] = useState(false);

  const fetchProfile = async (userId: string) => {
    try {
      // En un entorno real, esto sería una llamada a la base de datos
      const userJson = localStorage.getItem("user");
      
      if (!userJson) {
        setCreateMode(true);
        const initialForm = {
          id: userId,
          name: "",
          surname: "",
          email: "",
          dni: "",
          department: "",
          start_date: undefined,
          preferred_notification_channel: "web",
          profilePhoto: undefined
        };
        setForm(initialForm);
        return { createMode: true, form: initialForm };
      }
      
      const userData = JSON.parse(userJson);
      const profileData = {
        id: userData.id,
        name: userData.name || "",
        surname: userData.surname || "",
        email: userData.email || "",
        dni: userData.dni || "",
        department: userData.department || "",
        start_date: userData.startDate ? new Date(userData.startDate) : undefined,
        preferred_notification_channel: userData.preferredNotificationChannel || "web",
        profilePhoto: userData.profilePhoto
      };
      
      const profileWithDate = {
        ...profileData,
        start_date: profileData.start_date
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
