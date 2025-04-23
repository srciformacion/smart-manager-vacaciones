
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/main-layout";
import { ShiftProfileForm } from "@/components/shift/shift-profile-form";
import { ShiftProfilesList } from "@/components/shift/shift-profiles-list";
import { User, ShiftProfile } from "@/types";
import { Button } from "@/components/ui/button";
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from "@/components/ui/alert";
import { ArrowLeft } from "lucide-react";

// Datos de ejemplo
const exampleUser: User = {
  id: "1",
  name: "Ana Martínez",
  email: "ana.martinez@empresa.com",
  role: "worker",
  shift: "Programado Mañana",
  workGroup: "Grupo Programado",
  workday: "Completa",
  department: "Urgencias y Emergencias",
  seniority: 3,
};

// Ejemplos de perfiles de turno
const exampleProfiles: ShiftProfile[] = [
  {
    id: "prof-1",
    userId: "1",
    shiftType: "Programado Mañana",
    workDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    startTime: "08:00",
    endTime: "15:00",
    createdBy: "empresa",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15"),
    isDefault: true,
  },
  {
    id: "prof-2",
    userId: "1",
    shiftType: "Turno 24h",
    workDays: ["saturday", "sunday"],
    startTime: "08:00",
    endTime: "08:00",
    createdBy: "trabajador",
    createdAt: new Date("2023-02-20"),
    updatedAt: new Date("2023-02-20"),
    isDefault: false,
  }
];

type PageState = 
  | "list"
  | "create"
  | "edit"
  | "success";

export default function ShiftProfilePage() {
  const [user] = useState<User>(exampleUser);
  const [profiles, setProfiles] = useState<ShiftProfile[]>(exampleProfiles);
  const [pageState, setPageState] = useState<PageState>("list");
  const [selectedProfile, setSelectedProfile] = useState<ShiftProfile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const navigate = useNavigate();

  // Manejar la creación de un nuevo perfil
  const handleCreateProfile = () => {
    setSelectedProfile(null);
    setPageState("create");
  };

  // Manejar la edición de un perfil
  const handleEditProfile = (profile: ShiftProfile) => {
    setSelectedProfile(profile);
    setPageState("edit");
  };

  // Manejar el envío del formulario
  const handleFormSubmit = async (values: any) => {
    setIsSubmitting(true);
    
    try {
      // En una implementación real, enviaríamos a una API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular petición
      
      if (pageState === "create") {
        // Crear nuevo perfil
        const newProfile: ShiftProfile = {
          id: `prof-${Date.now()}`,
          userId: user.id,
          shiftType: values.shiftType as any,
          workDays: values.workDays as any,
          startTime: values.startTime,
          endTime: values.endTime,
          createdBy: values.createdBy as any,
          createdAt: new Date(),
          updatedAt: new Date(),
          isDefault: values.isDefault,
        };
        
        // Si es perfil predeterminado, actualizar otros perfiles
        const updatedProfiles = values.isDefault
          ? profiles.map(p => ({ ...p, isDefault: false }))
          : [...profiles];
        
        setProfiles([...updatedProfiles, newProfile]);
        setSuccessMessage("Perfil de turno creado correctamente");
      } else if (pageState === "edit" && selectedProfile) {
        // Actualizar perfil existente
        const updatedProfiles = profiles.map(profile => {
          if (profile.id === selectedProfile.id) {
            return {
              ...profile,
              shiftType: values.shiftType as any,
              workDays: values.workDays as any,
              startTime: values.startTime,
              endTime: values.endTime,
              createdBy: values.createdBy as any,
              updatedAt: new Date(),
              isDefault: values.isDefault,
            };
          }
          
          // Si el perfil editado se establece como predeterminado, los demás no lo son
          if (values.isDefault && profile.isDefault) {
            return { ...profile, isDefault: false };
          }
          
          return profile;
        });
        
        setProfiles(updatedProfiles);
        setSuccessMessage("Perfil de turno actualizado correctamente");
      }
      
      setPageState("success");
      
      // Volver a la lista después de un tiempo
      setTimeout(() => {
        setPageState("list");
        setSuccessMessage(null);
      }, 2000);
      
    } catch (error) {
      console.error("Error al guardar perfil:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejar la eliminación de un perfil
  const handleDeleteProfile = async (profileId: string) => {
    try {
      // En una implementación real, enviaríamos a una API
      await new Promise(resolve => setTimeout(resolve, 500)); // Simular petición
      
      const updatedProfiles = profiles.filter(profile => profile.id !== profileId);
      setProfiles(updatedProfiles);
      
      // Mostrar mensaje de éxito
      setSuccessMessage("Perfil de turno eliminado correctamente");
      setPageState("success");
      
      // Volver a la lista después de un tiempo
      setTimeout(() => {
        setPageState("list");
        setSuccessMessage(null);
      }, 2000);
      
    } catch (error) {
      console.error("Error al eliminar perfil:", error);
    }
  };

  // Manejar establecer un perfil como predeterminado
  const handleSetDefaultProfile = async (profileId: string) => {
    try {
      // En una implementación real, enviaríamos a una API
      await new Promise(resolve => setTimeout(resolve, 500)); // Simular petición
      
      const updatedProfiles = profiles.map(profile => ({
        ...profile,
        isDefault: profile.id === profileId
      }));
      
      setProfiles(updatedProfiles);
      
      // Mostrar mensaje de éxito
      setSuccessMessage("Perfil de turno establecido como predeterminado");
      setPageState("success");
      
      // Volver a la lista después de un tiempo
      setTimeout(() => {
        setPageState("list");
        setSuccessMessage(null);
      }, 2000);
      
    } catch (error) {
      console.error("Error al establecer perfil predeterminado:", error);
    }
  };

  // Renderizar el contenido según el estado
  const renderContent = () => {
    switch (pageState) {
      case "create":
        return (
          <ShiftProfileForm
            user={user}
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
          />
        );

      case "edit":
        return selectedProfile ? (
          <ShiftProfileForm
            user={user}
            existingProfile={selectedProfile}
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
          />
        ) : null;

      case "success":
        return (
          <Alert className="bg-success/10 border-success/30">
            <AlertTitle>Operación completada</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        );

      case "list":
      default:
        return (
          <ShiftProfilesList
            profiles={profiles}
            user={user}
            onCreateProfile={handleCreateProfile}
            onEditProfile={handleEditProfile}
            onDeleteProfile={handleDeleteProfile}
            onSetDefaultProfile={handleSetDefaultProfile}
          />
        );
    }
  };

  return (
    <MainLayout user={user}>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de perfiles de turno</h1>
        </div>

        <div className="px-4 py-3 bg-primary/10 rounded-lg">
          <p className="text-sm">
            Los perfiles de turno le permiten definir sus horarios habituales para facilitar la solicitud de vacaciones, 
            permisos y cambios de turno. Puede crear múltiples perfiles y establecer uno como predeterminado.
          </p>
        </div>

        {renderContent()}
      </div>
    </MainLayout>
  );
}
