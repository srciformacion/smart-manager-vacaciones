
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const MOCK_USER = {
  name: "Juan",
  surname: "Pérez",
  email: "juan.perez@larioja.cuida",
  dni: "12345678A",
  department: "Recursos Humanos",
};

export default function ProfilePage() {
  const [edit, setEdit] = useState(false);
  const [user, setUser] = useState(MOCK_USER);

  const [form, setForm] = useState(MOCK_USER);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setUser(form);
    setEdit(false);
    toast({ title: "Perfil actualizado", description: "Tus datos se guardaron (modo demo)" });
  };

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
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Apellidos</label>
            <Input
              name="surname"
              disabled={!edit}
              value={form.surname}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              name="email"
              disabled={!edit}
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">DNI</label>
            <Input
              name="dni"
              disabled={!edit}
              value={form.dni}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Departamento</label>
            <Input
              name="department"
              disabled
              value={form.department}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mt-8 flex gap-3 justify-end">
          {edit ? (
            <>
              <Button variant="outline" onClick={() => { setForm(user); setEdit(false); }}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>Guardar cambios</Button>
            </>
          ) : (
            <Button onClick={() => setEdit(true)}>Editar perfil</Button>
          )}
        </div>
      </Card>
    </div>
  );
}
