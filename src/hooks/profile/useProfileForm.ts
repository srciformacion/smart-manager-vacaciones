
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
        const { error } = await supabase
          .from("profiles")
          .insert([{
            id: userId,
            name: form.name,
            surname: form.surname,
            email: form.email,
            dni: form.dni,
            department: form.department,
            start_date: form.start_date?.toISOString().split('T')[0]
          }]);

        if (error) throw error;
        
        toast({ 
          title: "Perfil creado", 
          description: "Tu perfil ha sido creado exitosamente." 
        });
      } else {
        const { error } = await supabase
          .from("profiles")
          .update({
            name: form.name,
            surname: form.surname,
            dni: form.dni,
            department: form.department,
            start_date: form.start_date?.toISOString().split('T')[0]
          })
          .eq("id", userId);

        if (error) throw error;
        
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | Date) => {
    if (!form) return;
    
    if (e instanceof Date) {
      setForm({ ...form, start_date: e });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
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
  };
};
