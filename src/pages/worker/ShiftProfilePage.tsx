
import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { ShiftProfileForm } from "@/components/shift/shift-profile-form";
import { ShiftProfilesList } from "@/components/shift/shift-profiles-list";
import { Button } from "@/components/ui/button";
import { User, ShiftProfile, Department } from "@/types";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Datos de ejemplo
const exampleUser: User = {
  id: "1",
  name: "Ana García",
  email: "ana.garcia@empresa.com",
  role: "worker",
  shift: "Programado Mañana",
  workGroup: "Grupo Programado",
  workday: "Completa",
  department: "Urgencias y Emergencias (Transporte Urgente)", // Corregido para que coincida con el tipo Department
  seniority: 5,
  startDate: new Date("2018-03-15"),
  workDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  shiftStartTime: "08:00",
  shiftEndTime: "15:00"
};

const exampleProfiles: ShiftProfile[] = [
  {
    id: "prof-1",
    userId: "1",
    name: "Turno de Mañana",
    shiftType: "Programado Mañana",
    workDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    startTime: "08:00",
    endTime: "15:00",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15"),
    createdBy: "trabajador",
    isDefault: true
  },
  {
    id: "prof-2",
    userId: "1",
    name: "Turno de Tarde",
    shiftType: "Programado Tarde",
    workDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    startTime: "15:00",
    endTime: "22:00",
    createdAt: new Date("2023-02-20"),
    updatedAt: new Date("2023-02-20"),
    createdBy: "trabajador",
    isDefault: false
  }
];

export default function ShiftProfilePage() {
  const [user, setUser] = useState<User | null>(exampleUser);
  const [profiles, setProfiles] = useState<ShiftProfile[]>(exampleProfiles);
  const [isCreating, setIsCreating] = useState(false);
  const [editingProfile, setEditingProfile] = useState<ShiftProfile | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Aquí podrías cargar los perfiles de turno del usuario desde la base de datos
    // o desde un contexto global
  }, []);

  const handleCreate = () => {
    setIsCreating(true);
    setEditingProfile(null);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingProfile(null);
  };

  const handleEdit = (profile: ShiftProfile) => {
    setEditingProfile(profile);
    setIsCreating(false);
  };

  const handleSubmit = (values: any) => {
    // Convert form values to ShiftProfile
    const shiftProfileData = {
      ...values,
      name: values.shiftType, // Use shiftType as default name if not provided
    };
    
    if (editingProfile) {
      // Actualizar perfil existente
      const updatedProfiles = profiles.map(profile => {
        if (profile.id === editingProfile.id) {
          return {
            ...profile,
            ...shiftProfileData,
            updatedAt: new Date()
          };
        }
        return profile;
      });
      
      setProfiles(updatedProfiles);
      
      toast({
        title: "Perfil de turno actualizado",
        description: "El perfil se ha actualizado correctamente.",
      });
    } else {
      // Crear nuevo perfil
      const newProfile: ShiftProfile = {
        id: `prof-${Date.now()}`,
        userId: user!.id,
        name: shiftProfileData.shiftType,
        shiftType: shiftProfileData.shiftType,
        workDays: shiftProfileData.workDays,
        startTime: shiftProfileData.startTime,
        endTime: shiftProfileData.endTime,
        createdBy: shiftProfileData.createdBy,
        isDefault: shiftProfileData.isDefault,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setProfiles([...profiles, newProfile]);
      
      toast({
        title: "Perfil de turno creado",
        description: "El nuevo perfil se ha creado correctamente.",
      });
    }
    
    setIsCreating(false);
    setEditingProfile(null);
  };

  const handleUpdate = (id: string, values: Partial<ShiftProfile>) => {
    // Simulación de actualización de perfil
    const updatedProfiles = profiles.map((profile) => {
      if (profile.id === id) {
        return {
          ...profile,
          ...values,
          updatedAt: new Date(),
        };
      }
      return profile;
    });

    setProfiles(updatedProfiles);

    toast({
      title: "Perfil de turno actualizado",
      description: "El perfil de turno se ha actualizado correctamente.",
    });
  };

  const handleDelete = (id: string) => {
    // Simulación de eliminación de perfil
    const updatedProfiles = profiles.filter((profile) => profile.id !== id);
    setProfiles(updatedProfiles);

    toast({
      title: "Perfil de turno eliminado",
      description: "El perfil de turno se ha eliminado correctamente.",
    });
  };

  const handleSetDefaultProfile = (id: string) => {
    const updatedProfiles = profiles.map((profile) => ({
      ...profile,
      isDefault: profile.id === id,
      updatedAt: profile.id === id ? new Date() : profile.updatedAt
    }));
    
    setProfiles(updatedProfiles);
    
    toast({
      title: "Perfil predeterminado establecido",
      description: "El perfil seleccionado ahora es el predeterminado.",
    });
  };

  return (
    <MainLayout user={user}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Perfiles de turno
          </h1>
          <p className="text-muted-foreground mt-2">
            Administra tus perfiles de turno personalizados
          </p>
        </div>

        {(isCreating || editingProfile) ? (
          <ShiftProfileForm
            user={user || undefined}
            existingProfile={editingProfile || undefined}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            isSubmitting={false}
          />
        ) : (
          <>
            <div className="flex justify-end">
              <Button onClick={handleCreate}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Crear perfil
              </Button>
            </div>

            <ShiftProfilesList
              profiles={profiles}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              onEditProfile={handleEdit}
              onCreateProfile={handleCreate}
              onSetDefaultProfile={handleSetDefaultProfile}
            />
          </>
        )}
      </div>
    </MainLayout>
  );
}
