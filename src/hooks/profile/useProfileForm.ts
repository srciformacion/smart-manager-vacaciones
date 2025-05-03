
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Profile } from "@/components/profile/types";

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
    if (!form || !userId) {
      toast({ 
        variant: "destructive",
        title: "Error", 
        description: "Datos de formulario inválidos." 
      });
      return;
    }

    setSaving(true);
    try {
      if (!profile) {
        // En un entorno real, esto sería una llamada a la API para guardar en la base de datos
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = {
          ...userData,
          name: form.name,
          surname: form.surname,
          email: form.email,
          dni: form.dni,
          department: form.department,
          startDate: form.start_date?.toISOString().split('T')[0],
          preferredNotificationChannel: form.preferred_notification_channel || 'web',
          profilePhoto: form.profilePhoto || null
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        toast({ 
          title: "Perfil creado", 
          description: "Tu perfil ha sido creado exitosamente." 
        });
      } else {
        // En un entorno real, esto sería una llamada a la API para actualizar en la base de datos
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = {
          ...userData,
          name: form.name,
          surname: form.surname,
          dni: form.dni,
          department: form.department,
          startDate: form.start_date?.toISOString().split('T')[0],
          preferredNotificationChannel: form.preferred_notification_channel || 'web',
          profilePhoto: form.profilePhoto || userData.profilePhoto || null
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        toast({ 
          title: "Perfil actualizado", 
          description: "Los cambios han sido guardados exitosamente." 
        });
      }
      
      setEdit(false);
      setProfile(form);
    } catch (error: any) {
      toast({ 
        variant: "destructive",
        title: "Error", 
        description: error.message || "No se pudieron guardar los cambios." 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | Date) => {
    if (!form) return;
    
    if (e instanceof Date) {
      setForm({ ...form, start_date: e });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleProfilePhotoChange = (photoUrl: string) => {
    if (!form) return;
    setForm({ ...form, profilePhoto: photoUrl });
  };

  const handleCancel = () => {
    if (!profile) {
      toast({ 
        variant: "destructive",
        title: "Información requerida", 
        description: "Debes completar tu perfil para continuar." 
      });
      return;
    }
    setEdit(false);
    setForm(profile);
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
