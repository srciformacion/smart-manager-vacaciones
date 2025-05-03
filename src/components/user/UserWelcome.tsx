
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import { User } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

type BalanceDataType = {
  vacationDays: number;
  personalDays: number;
  leaveDays: number;
};

interface UserWelcomeProps {
  user: User | null;
  balanceData?: BalanceDataType;
  isLoading?: boolean;
}

export function UserWelcome({ user, balanceData, isLoading = false }: UserWelcomeProps) {
  if (isLoading) {
    return (
      <div className="space-y-4 p-4 md:p-8">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-60" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Alert className="max-w-lg mx-auto mt-8">
        <Info className="h-4 w-4" />
        <AlertDescription>
          No se pudo cargar la información del usuario. Por favor, vuelve a iniciar sesión.
        </AlertDescription>
      </Alert>
    );
  }

  const getInitials = () => {
    if (!user) return "U";
    const name = user.name || "";
    const surname = user.surname || "";
    return (name.charAt(0) + (surname ? surname.charAt(0) : "")).toUpperCase();
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">¡Bienvenido/a!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="" />
              <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-xl font-bold">{user.name || "Usuario"} {user.surname || ""}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="capitalize">
                  {user.role === 'hr' ? 'RRHH' : 'Trabajador'}
                </Badge>
                {user.workGroup && (
                  <Badge variant="outline" className="capitalize">
                    {user.workGroup}
                  </Badge>
                )}
                {user.department && (
                  <Badge variant="outline" className="capitalize">
                    {user.department}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {balanceData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Vacaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{balanceData.vacationDays || 0} días</div>
              <p className="text-xs text-muted-foreground mt-1">Disponibles este año</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Días personales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{balanceData.personalDays || 0} días</div>
              <p className="text-xs text-muted-foreground mt-1">Disponibles este año</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Permisos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{balanceData.leaveDays || 0} días</div>
              <p className="text-xs text-muted-foreground mt-1">Disponibles este año</p>
            </CardContent>
          </Card>
        </div>
      )}

      {!balanceData && (
        <Alert className="bg-muted">
          <Info className="h-4 w-4" />
          <AlertDescription>
            No se encontraron datos de saldos. Contacte con el departamento de RRHH para configurar sus saldos de días.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
