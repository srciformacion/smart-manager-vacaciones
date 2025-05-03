
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, RefreshCw, UserRound } from "lucide-react";

export interface ProfilePhotoUploadProps {
  photoUrl?: string;
  disabled: boolean;
  onPhotoChange: (photoUrl: string) => void;
}

export const ProfilePhotoUpload = ({ photoUrl, disabled, onPhotoChange }: ProfilePhotoUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleButtonClick = () => {
    if (disabled) return;
    setIsUploading(true);

    // Simulamos la carga de una imagen en un entorno real se usaría un selector de archivos
    // y se subiría el archivo a un servidor
    setTimeout(() => {
      // Generamos una URL aleatoria para simular una carga de imagen
      const randomId = Math.floor(Math.random() * 1000);
      const mockImageUrl = `https://randomuser.me/api/portraits/${randomId % 2 ? 'men' : 'women'}/${randomId % 100}.jpg`;
      onPhotoChange(mockImageUrl);
      setIsUploading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="w-24 h-24 border-2 border-gray-200">
        {photoUrl ? (
          <AvatarImage src={photoUrl} alt="Foto de perfil" />
        ) : (
          <AvatarFallback>
            <UserRound className="h-12 w-12 text-muted-foreground" />
          </AvatarFallback>
        )}
      </Avatar>
      
      {!disabled && (
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          disabled={isUploading || disabled}
          onClick={handleButtonClick}
          className="flex items-center"
        >
          {isUploading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              <span>Subiendo...</span>
            </>
          ) : (
            <>
              <Camera className="mr-2 h-4 w-4" />
              <span>{photoUrl ? "Cambiar foto" : "Añadir foto"}</span>
            </>
          )}
        </Button>
      )}
    </div>
  );
};
