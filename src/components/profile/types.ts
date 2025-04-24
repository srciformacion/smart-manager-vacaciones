
export interface Profile {
  id: string;
  name: string;
  surname: string;
  email: string;
  dni: string;
  department: string;
  start_date?: Date;
}

export interface ProfileFormProps {
  form: Profile;
  edit: boolean;
  saving: boolean;
  createMode: boolean;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement> | Date) => void;
}
