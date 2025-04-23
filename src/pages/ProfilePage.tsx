
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

type Profile = {
  id: string;
  name: string;
  surname: string;
  email: string;
  dni: string;
  department: string;
};

export default function ProfilePage() {
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [createMode, setCreateMode] = useState(false);
  const navigate = useNavigate();

  // Obtener ID de usuario actual y cargar perfil
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

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) {
          if (profileError.code === 'PGRST116') {
            // Perfil no existe, configurar modo creación
            setCreateMode(true);
            const initialForm = {
              id: user.id,
              name: user.user_metadata?.name || "",
              surname: user.user_metadata?.surname || "",
              email: user.email || "",
              dni: "",
              department: ""
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
          setProfile(profileData);
          setForm(profileData);
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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!form) return;
    setForm({ ...form, [e.target.name]: e.target.value });
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
            department: form.department
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
            department: form.department
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

  if (loading) {
    return (
      <div className="max-w-xl mx-auto mt-16 text-center text-muted-foreground text-lg">
        Cargando perfil...
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-8">
      <Card className="p-8 bg-white shadow-md">
        <div className="flex items-center gap-4 mb-6">
          <div className="rounded-full bg-purple-100 p-3">
            <User size={32} className="text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold">
            {createMode ? "Crear perfil de usuario" : "Perfil de usuario"}
          </h1>
        </div>

        {form && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <Input
                name="name"
                disabled={!edit}
                value={form.name || ""}
                onChange={handleChange}
                autoComplete="off"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Apellidos</label>
              <Input
                name="surname"
                disabled={!edit}
                value={form.surname || ""}
                onChange={handleChange}
                autoComplete="off"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                name="email"
                disabled
                value={form.email || ""}
                autoComplete="off"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">DNI</label>
              <Input
                name="dni"
                disabled={!edit}
                value={form.dni || ""}
                onChange={handleChange}
                autoComplete="off"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Departamento</label>
              <Input
                name="department"
                disabled={!edit}
                value={form.department || ""}
                onChange={handleChange}
                autoComplete="off"
                required
              />
            </div>
          </div>
        )}

        <div className="mt-8 flex gap-3 justify-end">
          {edit ? (
            <>
              {!createMode && (
                <Button variant="outline" onClick={handleCancel} disabled={saving}>
                  Cancelar
                </Button>
              )}
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Guardando..." : createMode ? "Crear perfil" : "Guardar cambios"}
              </Button>
            </>
          ) : (
            <Button onClick={() => setEdit(true)}>Editar perfil</Button>
          )}
        </div>
      </Card>
    </div>
  );
}
