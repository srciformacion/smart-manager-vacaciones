
import React from 'react';
import { MainLayout } from "@/components/layout/main-layout";
import { useProfileAuth } from "@/hooks/profile/useProfileAuth";
import { exampleWorkers } from "@/data/example-users";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search } from "lucide-react";

export default function HRWorkersPage() {
  const { user } = useProfileAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredWorkers = exampleWorkers.filter(worker => 
    worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.department.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <MainLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Gestión de trabajadores</h1>
          <p className="text-muted-foreground">Administra la información de los empleados</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Lista de trabajadores</CardTitle>
            <CardDescription>
              {exampleWorkers.length} trabajadores en el sistema
            </CardDescription>
            <div className="relative mt-2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, email o departamento"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Turno</TableHead>
                    <TableHead>Jornada</TableHead>
                    <TableHead>Antigüedad</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWorkers.length > 0 ? (
                    filteredWorkers.map(worker => (
                      <TableRow key={worker.id}>
                        <TableCell className="font-medium">{worker.name}</TableCell>
                        <TableCell>{worker.email}</TableCell>
                        <TableCell>{worker.department}</TableCell>
                        <TableCell>
                          <Badge variant={
                            worker.shift === "Urgente 24h" ? "destructive" : 
                            worker.shift === "Localizado" ? "outline" : "default"
                          }>
                            {worker.shift}
                          </Badge>
                        </TableCell>
                        <TableCell>{worker.workday}</TableCell>
                        <TableCell>{worker.seniority} años</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No se encontraron resultados.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
