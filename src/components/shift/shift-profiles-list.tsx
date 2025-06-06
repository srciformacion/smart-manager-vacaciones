
import { useState } from "react";
import { ShiftProfile, User } from "@/types";  // Added User import
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Clock, Calendar, Check, Pencil, Plus, Trash2 } from "lucide-react";

interface ShiftProfilesListProps {
  profiles: ShiftProfile[];
  onUpdate?: (id: string, values: Partial<ShiftProfile>) => void;
  onDelete?: (id: string) => void;
  onCreateProfile?: () => void;
  onEditProfile?: (profile: ShiftProfile) => void;
  onSetDefaultProfile?: (profileId: string) => void;
  user?: User;
}

// Función para convertir WeekDay a texto en español
const getWeekDayText = (day: string): string => {
  const days: Record<string, string> = {
    Monday: 'Lunes',
    Tuesday: 'Martes',
    Wednesday: 'Miércoles',
    Thursday: 'Jueves',
    Friday: 'Viernes',
    Saturday: 'Sábado',
    Sunday: 'Domingo',
    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo'
  };
  return days[day] || day;
};

export function ShiftProfilesList({
  profiles,
  onUpdate,
  onDelete,
  onCreateProfile,
  onEditProfile,
  onSetDefaultProfile,
  user
}: ShiftProfilesListProps) {
  
  const handleEdit = (profile: ShiftProfile) => {
    if (onEditProfile) {
      onEditProfile(profile);
    } else if (onUpdate) {
      // Compatibilidad con versiones anteriores
      // Esta función no se llama en ShiftProfilePage actual, pero la añadimos por compatibilidad
      console.warn('onEditProfile no definido, usando onUpdate');
    }
  };
  
  const handleSetDefault = (profileId: string) => {
    if (onSetDefaultProfile) {
      onSetDefaultProfile(profileId);
    } else if (onUpdate) {
      // Compatibilidad con implementación anterior
      onUpdate(profileId, { isDefault: true });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Perfiles de turno</CardTitle>
          <CardDescription>Gestione sus perfiles de turno personalizados</CardDescription>
        </div>
        <Button onClick={onCreateProfile} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo perfil
        </Button>
      </CardHeader>
      <CardContent>
        {profiles.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No hay perfiles de turno</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Cree su primer perfil de turno para facilitar sus solicitudes
            </p>
            <Button onClick={onCreateProfile}>
              <Plus className="mr-2 h-4 w-4" />
              Crear perfil de turno
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo de turno</TableHead>
                  <TableHead>Días laborables</TableHead>
                  <TableHead>Horario</TableHead>
                  <TableHead>Creado por</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell>{profile.shiftType}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {profile.workDays.map((day) => (
                          <Badge key={day} variant="outline" className="text-xs">
                            {getWeekDayText(day)}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {profile.shiftType === 'Turno 24h' 
                        ? '24 horas' 
                        : `${profile.startTime} - ${profile.endTime}`}
                    </TableCell>
                    <TableCell>
                      {profile.createdBy === 'trabajador' ? 'Trabajador' : 'Empresa'}
                    </TableCell>
                    <TableCell>
                      {profile.isDefault ? (
                        <Badge className="bg-success/20 text-success border-success/30">
                          Predeterminado
                        </Badge>
                      ) : (
                        <Badge variant="outline">Alternativo</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {!profile.isDefault && (
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => onSetDefaultProfile 
                              ? onSetDefaultProfile(profile.id)
                              : onUpdate && onUpdate(profile.id, { isDefault: true })
                            }
                            title="Establecer como predeterminado"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => onEditProfile 
                            ? onEditProfile(profile) 
                            : handleEdit(profile)
                          }
                          title="Editar perfil"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => onDelete && onDelete(profile.id)}
                          title="Eliminar perfil"
                          disabled={profile.isDefault}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
