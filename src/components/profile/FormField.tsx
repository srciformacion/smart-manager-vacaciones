
import { Input } from "@/components/ui/input";

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  type?: string;
  required?: boolean;
}

export const FormField = ({
  label,
  name,
  value,
  onChange,
  disabled,
  type = "text",
  required,
}: FormFieldProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <Input
        type={type}
        name={name}
        disabled={disabled}
        value={value || ""}
        onChange={onChange}
        autoComplete="off"
        required={required}
      />
    </div>
  );
};
