
import React from 'react';
import { MainLayout } from "@/components/layout/main-layout";
import { useProfileAuth } from "@/hooks/profile/useProfileAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileBarChart, FileCog, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const reportTypes = [
  { 
    name: "Informe de personal", 
    icon: <Users className="h-8 w-8 text-muted-foreground" />, 
    description: "Datos estadísticos sobre personal, departamentos y turnos",
    href: "/rrhh/reports"
  },
  { 
    name: "Informe de asistencia", 
    icon: <FileBarChart className="h-8 w-8 text-muted-foreground" />, 
    description: "Análisis de asistencia, ausencias y solicitudes",
    href: "/rrhh/reports"
  },
  { 
    name: "Configuración de informes", 
    icon: <FileCog className="h-8 w-8 text-muted-foreground" />, 
    description: "Personaliza y programa informes automáticos",
    href: "/rrhh/reports"
  }
];

export default function HRReportsPage() {
  const { user } = useProfileAuth();
  
  return (
    <MainLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Informes</h1>
          <p className="text-muted-foreground">Genera informes y estadísticas</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reportTypes.map((report, index) => (
            <Card key={index} className="h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg font-medium">{report.name}</CardTitle>
                {report.icon}
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">{report.description}</CardDescription>
                <Button asChild variant="outline" className="w-full">
                  <Link to={report.href}>
                    Ver informe
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Informes recientes</CardTitle>
            <CardDescription>Accede rápidamente a los últimos informes generados</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-6 text-muted-foreground">Aún no hay informes generados</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
