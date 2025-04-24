
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  edit: boolean;
  saving: boolean;
  createMode: boolean;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
}

export const FormActions = ({
  edit,
  saving,
  createMode,
  onSave,
  onCancel,
  onEdit,
}: FormActionsProps) => {
  return (
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
  );
};
