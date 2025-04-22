
import { ChangeEvent, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  accept?: string;
  className?: string;
  buttonText?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function FileUpload({
  onFileChange,
  accept = "application/pdf,image/*",
  className,
  buttonText = "Subir archivo",
  placeholder = "Ningún archivo seleccionado",
  disabled = false,
}: FileUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setFileName(file.name);
      onFileChange(file);
    } else {
      setFileName(null);
      onFileChange(null);
    }
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
        disabled={disabled}
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => document.getElementById("file-upload")?.click()}
        disabled={disabled}
      >
        {buttonText}
      </Button>
      <div className="text-sm text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]">
        {fileName || placeholder}
      </div>
    </div>
  );
}
