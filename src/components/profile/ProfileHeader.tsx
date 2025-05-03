
import React from "react";
import { User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  isCreateMode: boolean;
  photoUrl?: string;
}

export const ProfileHeader = ({ isCreateMode, photoUrl }: ProfileHeaderProps) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <Avatar className="h-12 w-12 bg-purple-100">
        {photoUrl ? (
          <AvatarImage src={photoUrl} alt="Foto de perfil" />
        ) : (
          <AvatarFallback className="bg-purple-100">
            <User className="text-purple-600" />
          </AvatarFallback>
        )}
      </Avatar>
      <h1 className="text-2xl font-bold">
        {isCreateMode ? "Crear perfil de usuario" : "Perfil de usuario"}
      </h1>
    </div>
  );
};
