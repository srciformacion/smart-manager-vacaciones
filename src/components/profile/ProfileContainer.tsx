
import { Card } from "@/components/ui/card";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileForm } from "./ProfileForm";

interface ProfileContainerProps {
  createMode: boolean;
  form: any;
  edit: boolean;
  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement> | Date) => void;
}

export const ProfileContainer = ({
  createMode,
  form,
  edit,
  saving,
  onSave,
  onCancel,
  onEdit,
  onChange,
}: ProfileContainerProps) => {
  return (
    <div className="max-w-xl mx-auto mt-8">
      <Card className="p-8 bg-white shadow-md">
        <ProfileHeader isCreateMode={createMode} />
        {form && (
          <ProfileForm
            form={form}
            edit={edit}
            saving={saving}
            createMode={createMode}
            onSave={onSave}
            onCancel={onCancel}
            onEdit={onEdit}
            onChange={onChange}
          />
        )}
      </Card>
    </div>
  );
};
