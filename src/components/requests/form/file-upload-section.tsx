
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { FileUpload } from "@/components/ui/file-upload";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./request-form-schema";

interface FileUploadSectionProps {
  onFileChange: (file: File | null) => void;
  isSubmitting?: boolean;
}

export function FileUploadSection({ onFileChange, isSubmitting }: FileUploadSectionProps) {
  return (
    <FormItem>
      <FormLabel>Justificante</FormLabel>
      <FormControl>
        <FileUpload
          onFileChange={onFileChange}
          disabled={isSubmitting}
          buttonText="Subir justificante"
          placeholder="Seleccione un archivo"
        />
      </FormControl>
      <FormDescription>
        Suba un documento justificativo (PDF, imagen)
      </FormDescription>
      <FormMessage />
    </FormItem>
  );
}
