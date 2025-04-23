
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
        } else if (data) {
          setProfile(data as Profile);
          setForm(data as Profile);
        }
        setLoading(false);
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
    const { error } = await supabase
      .from("profiles")
      .update({
        name: form.name,
        surname: form.surname,
        dni: form.dni,
      })
      .eq("id", userId);

    setSaving(false);

    if (error) {
      toast({ title: "Error", description: "No se pudieron guardar los cambios." });
    } else {
      setEdit(false);
      setProfile(form);
      toast({ title: "Perfil actualizado", description: "Tus datos han sido guardados." });
    }
  }

  // Cancelar edición
  function handleCancel() {
    setEdit(false);
    setForm(profile);
  }

  if (loading || !form) {
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
            Perfil de usuario
          </h1>
        </div>

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
              disabled
              value={form.department || ""}
              autoComplete="off"
            />
          </div>
        </div>

        <div className="mt-8 flex gap-3 justify-end">
          {edit ? (
            <>
              <Button variant="outline" onClick={handleCancel} disabled={saving}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Guardando..." : "Guardar cambios"}
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
