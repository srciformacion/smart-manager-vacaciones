
import { useState } from "react";
import { Profile } from "@/components/profile/types";
import { toast } from "@/components/ui/use-toast";

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
    if (!form) return;
    
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
      // En un entorno real, aquí harías una llamada a la API para guardar los datos
      // Por ahora, simulamos un retardo y actualizamos el estado
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setProfile(form);
      setEdit(false);
      
      // Guardamos también en localStorage para simular persistencia
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
        description: "No se pudo guardar los cambios. Intentalo de nuevo más tarde.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | Date) => {
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

  const handleProfilePhotoChange = (photoUrl: string) => {
    if (!form) return;
    
    setForm({
      ...form,
      profilePhoto: photoUrl,
    });
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
