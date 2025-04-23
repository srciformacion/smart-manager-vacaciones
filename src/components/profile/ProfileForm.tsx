
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Profile {
  id: string;
  name: string;
  surname: string;
  email: string;
  dni: string;
  department: string;
}

interface ProfileFormProps {
  form: Profile;
  edit: boolean;
  saving: boolean;
  createMode: boolean;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileForm = ({
  form,
  edit,
  saving,
  createMode,
  onSave,
  onCancel,
  onEdit,
  onChange,
}: ProfileFormProps) => {
  return (
    <>
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <Input
            name="name"
            disabled={!edit}
            value={form.name || ""}
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
            autoComplete="off"
            required
          />
        </div>
      </div>

      <div className="mt-8 flex gap-3 justify-end">
        {edit ? (
          <>
            {!createMode && (
              <Button variant="outline" onClick={onCancel} disabled={saving}>
                Cancelar
              </Button>
            )}
            <Button onClick={onSave} disabled={saving}>
              {saving ? "Guardando..." : createMode ? "Crear perfil" : "Guardar cambios"}
            </Button>
          </>
        ) : (
          <Button onClick={onEdit}>Editar perfil</Button>
        )}
      </div>
    </>
  );
};
