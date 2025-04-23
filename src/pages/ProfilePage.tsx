
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Tipo para el perfil según la tabla de Supabase
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

  // Obtener ID de usuario actual y cargar perfil
  useEffect(() => {
    let ignore = false;
    async function fetchProfile() {
      setLoading(true);
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError || !user?.user) {
        setLoading(false);
        toast({ title: "Error", description: "No se pudo obtener el usuario actual." });
        return;
      }
      const id = user.user.id;
      setUserId(id);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (!ignore) {
        if (error) {
          toast({ title: "Error", description: "No se pudo cargar tu perfil." });
          setLoading(false);
        } else if (data) {
          setProfile(data as Profile);
          setForm(data as Profile);
          setLoading(false);
        } else {
          // No existe perfil, configuramos modo de creación
          setCreateMode(true);
          // Inicializamos un formulario con datos básicos
          const initialForm = {
            id: id,
            name: user.user.user_metadata?.name || "",
            surname: user.user.user_metadata?.surname || "",
            email: user.user.email || "",
            dni: "",
            department: ""
          } as Profile;
          setForm(initialForm);
          setLoading(false);
          setEdit(true);
        }
      }
    }
    fetchProfile();
    return () => { ignore = true; };
  }, []);

  // Manejar cambios en el formulario
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!form) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Guardar los cambios
  async function handleSave() {
    if (!form || !userId) return;
    setSaving(true);

    try {
      if (createMode) {
        // Crear nuevo perfil
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
        
        toast({ title: "Perfil creado", description: "Tu perfil ha sido creado correctamente." });
        setCreateMode(false);
      } else {
        // Actualizar perfil existente
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
        
        toast({ title: "Perfil actualizado", description: "Tus datos han sido guardados." });
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

  // Cancelar edición
  function handleCancel() {
    if (createMode && !profile) {
      // Si estamos en modo creación y no hay perfil, no podemos cancelar
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
