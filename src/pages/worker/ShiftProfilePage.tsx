import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { ShiftProfileForm } from "@/components/shift/shift-profile-form";
import { ShiftProfilesList } from "@/components/shift/shift-profiles-list";
import { Button } from "@/components/ui/button";
import { User, ShiftProfile, ShiftType, WeekDay } from "@/types";
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
  department: "Urgencias y Emergencias (Transporte Urgente)",
  seniority: 5,
  startDate: new Date("2018-03-15"),
  workdays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  shiftStartTime: "08:00",
  shiftEndTime: "15:00"
};

const exampleProfiles: ShiftProfile[] = [
  {
    id: "prof-1",
    userId: "1",
    shiftType: "Programado Mañana",
    workDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    startTime: "08:00",
    endTime: "15:00",
    createdBy: "trabajador",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15"),
    isDefault: true
  },
  {
    id: "prof-2",
    userId: "1",
    shiftType: "Programado Tarde",
    workDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    startTime: "15:00",
    endTime: "22:00",
    createdBy: "trabajador",
    createdAt: new Date("2023-02-20"),
    updatedAt: new Date("2023-02-20"),
    isDefault: false
  }
];

export default function ShiftProfilePage() {
  const [user, setUser] = useState<User | null>(exampleUser);
  const [profiles, setProfiles] = useState<ShiftProfile[]>(exampleProfiles);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Aquí podrías cargar los perfiles de turno del usuario desde la base de datos
    // o desde un contexto global
  }, []);

  const handleCreate = () => {
    setIsCreating(true);
  };

  const handleCancel = () => {
    setIsCreating(false);
  };

  const handleSubmit = (values: Omit<ShiftProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    // Simulación de creación de perfil
    const newProfile: ShiftProfile = {
      id: `prof-${Date.now()}`,
      userId: user!.id,
      ...values,
      createdBy: "trabajador",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setProfiles([...profiles, newProfile]);
    setIsCreating(false);

    toast({
      title: "Perfil de turno creado",
      description: "El perfil de turno se ha creado correctamente.",
    });
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

        {isCreating ? (
          <ShiftProfileForm
            onCancel={handleCancel}
            onSubmit={handleSubmit}
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
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          </>
        )}
      </div>
    </MainLayout>
  );
}
