
import { useState } from "react";
import { Profile } from "@/components/profile/types";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UseProfileFormProps {
  userId: string | null;
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
  form: Profile | null;
  setForm: (form: Profile | null) => void;
}

export const useProfileForm = (
  userId: string | null,
  profile: Profile | null,
  setProfile: (profile: Profile | null) => void,
  form: Profile | null,
  setForm: (form: Profile | null) => void
) => {
  const [edit, setEdit] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form || !userId) return;
    
    // Check if notification consent is given when notification channels are selected
    if (form.notification_channels && form.notification_channels.length > 0 && !form.notification_consent) {
      toast({
        variant: "destructive",
        title: "Consentimiento requerido",
        description: "Debe autorizar el uso de canales de notificación seleccionados.",
      });
      return;
    }
    
    setSaving(true);
    try {
      // Preparamos los datos para guardar en Supabase
      const profileData = {
        id: userId,
        name: form.name,
        surname: form.surname,
        email: form.email,
        dni: form.dni,
        department: form.department,
        start_date: form.start_date,
        // No guardamos profilePhoto, notification_channels, notification_consent por ahora
      };
      
      // Intentamos actualizar el perfil en Supabase
      const { error } = await supabase
        .from('profiles')
        .upsert(profileData)
        .select();
      
      if (error) throw error;
      
      // Guardamos el perfil actualizado en el estado local
      setProfile(form);
      setEdit(false);
      
      // También guardamos en localStorage como respaldo
      localStorage.setItem(`profile-${userId}`, JSON.stringify(form));
      
      toast({
        title: "Perfil actualizado",
        description: "Los cambios en tu perfil han sido guardados.",
      });
    } catch (error) {
      console.error("Error al guardar el perfil:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar los cambios. Inténtalo de nuevo más tarde.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | Date | { target: { name: string; value: any } }) => {
    if (!form) return;
    
    if (e instanceof Date) {
      setForm({
        ...form,
        start_date: e,
      });
    } else {
      const { name, value } = e.target;
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleCancel = () => {
    setForm(profile);
    setEdit(false);
  };

  const handleProfilePhotoChange = async (photoUrl: string) => {
    if (!form || !userId) return;
    
    // Actualizamos localmente la foto de perfil
    setForm({
      ...form,
      profilePhoto: photoUrl,
    });
    
    // En una implementación real, aquí subiríamos la imagen a Supabase Storage
    // y guardaríamos la URL resultante
  };

  return {
    edit,
    saving,
    setEdit,
    handleSave,
    handleChange,
    handleCancel,
    handleProfilePhotoChange
  };
};
