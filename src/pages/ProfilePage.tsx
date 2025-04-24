
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { LoadingState } from "@/components/profile/LoadingState";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { MainLayout } from "@/components/layout/main-layout";
import { User } from "@/types";

type Profile = {
  id: string;
  name: string;
  surname: string;
  email: string;
  dni: string;
  department: string;
  start_date?: Date;
};

export default function ProfilePage() {
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [createMode, setCreateMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          toast({ 
            variant: "destructive",
            title: "Error de autenticación", 
            description: "Por favor inicia sesión para acceder a tu perfil." 
          });
          navigate("/login");
          return;
        }

        setUserId(user.id);
        setUser({
          id: user.id,
          name: user.user_metadata?.name || "",
          email: user.email || "",
          role: 'worker',
          shift: 'Programado',
          workGroup: 'Grupo Programado',
          workday: 'Completa',
          department: 'Administración',
          seniority: 0,
        });

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) {
          if (profileError.code === 'PGRST116') {
            setCreateMode(true);
            const initialForm = {
              id: user.id,
              name: user.user_metadata?.name || "",
              surname: user.user_metadata?.surname || "",
              email: user.email || "",
              dni: "",
              department: "",
              start_date: undefined,
            };
            setForm(initialForm);
            setEdit(true);
          } else {
            toast({ 
              variant: "destructive",
              title: "Error", 
              description: "No se pudo cargar el perfil." 
            });
          }
        } else {
          // Convertir la fecha de string a objeto Date si existe
          const profileWithDate = {
            ...profileData,
            start_date: profileData.start_date ? new Date(profileData.start_date) : undefined
          };
          setProfile(profileWithDate);
          setForm(profileWithDate);
        }
      } catch (error) {
        toast({ 
          variant: "destructive",
          title: "Error", 
          description: "Ocurrió un error al cargar el perfil." 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement> | Date) {
    if (!form) return;
    
    if (e instanceof Date) {
      setForm({ ...form, start_date: e });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  }

  async function handleSave() {
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
      if (createMode) {
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
        setCreateMode(false);
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
  }

  function handleCancel() {
    if (createMode && !profile) {
      toast({ 
        variant: "destructive",
        title: "Información requerida", 
        description: "Debes completar tu perfil para continuar." 
      });
      return;
    }
    setEdit(false);
    setForm(profile);
  }

  return (
    <MainLayout user={user}>
      {loading ? (
        <LoadingState />
      ) : (
        <div className="max-w-xl mx-auto mt-8">
          <Card className="p-8 bg-white shadow-md">
            <ProfileHeader isCreateMode={createMode} />
            {form && (
              <ProfileForm
                form={form}
                edit={edit}
                saving={saving}
                createMode={createMode}
                onSave={handleSave}
                onCancel={handleCancel}
                onEdit={() => setEdit(true)}
                onChange={handleChange}
              />
            )}
          </Card>
        </div>
      )}
    </MainLayout>
  );
}
