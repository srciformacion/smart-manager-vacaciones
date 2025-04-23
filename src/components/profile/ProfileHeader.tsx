
import React from "react";
import { User } from "lucide-react";

interface ProfileHeaderProps {
  isCreateMode: boolean;
}

export const ProfileHeader = ({ isCreateMode }: ProfileHeaderProps) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="rounded-full bg-purple-100 p-3">
        <User size={32} className="text-purple-600" />
      </div>
      <h1 className="text-2xl font-bold">
        {isCreateMode ? "Crear perfil de usuario" : "Perfil de usuario"}
      </h1>
    </div>
  );
};
