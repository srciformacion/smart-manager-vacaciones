
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Profile {
  id: string;
  name: string;
  surname: string;
  email: string;
  dni: string;
  department: string;
  start_date?: Date;
}

interface ProfileFormProps {
  form: Profile;
  edit: boolean;
  saving: boolean;
  createMode: boolean;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement> | Date) => void;
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
        <div>
          <label className="block text-sm font-medium mb-1">Fecha de inicio</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !form.start_date && "text-muted-foreground"
                )}
                disabled={!edit}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.start_date ? (
                  format(form.start_date, "PPP", { locale: es })
                ) : (
                  <span>Selecciona una fecha</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={form.start_date}
                onSelect={(date) => onChange(date as Date)}
                disabled={!edit}
                initialFocus
                locale={es}
              />
            </PopoverContent>
          </Popover>
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
