
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
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function HRWorkersPage() {
  const { user } = useProfileAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [shiftFilter, setShiftFilter] = useState<string | null>(null);
  
  const workersPerPage = 10;
  
  // Extract unique departments
  const departments = Array.from(new Set(exampleWorkers.map(worker => worker.department)));
  
  // Extract unique shifts
  const shifts = Array.from(new Set(exampleWorkers.map(worker => worker.shift)));
  
  // Apply filters
  const filteredWorkers = exampleWorkers.filter(worker => 
    (searchTerm === '' || 
     worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     worker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     worker.department.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (departmentFilter === null || worker.department === departmentFilter) &&
    (shiftFilter === null || worker.shift === shiftFilter)
  );
  
  // Paginate results
  const indexOfLastWorker = currentPage * workersPerPage;
  const indexOfFirstWorker = indexOfLastWorker - workersPerPage;
  const currentWorkers = filteredWorkers.slice(indexOfFirstWorker, indexOfLastWorker);
  const totalPages = Math.ceil(filteredWorkers.length / workersPerPage);
  
  const resetFilters = () => {
    setSearchTerm('');
    setDepartmentFilter(null);
    setShiftFilter(null);
    setCurrentPage(1);
  };
  
  return (
    <MainLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Gestión de trabajadores</h1>
          <p className="text-muted-foreground">Administra la información de los {exampleWorkers.length} empleados</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Lista de trabajadores</CardTitle>
            <CardDescription>
              {filteredWorkers.length} de {exampleWorkers.length} trabajadores mostrados
            </CardDescription>
            
            <div className="grid gap-4 mt-4 md:grid-cols-4">
              <div className="relative col-span-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, email o departamento"
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              
              <Select 
                value={departmentFilter || ""} 
                onValueChange={(value) => {
                  setDepartmentFilter(value || null);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los departamentos</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={shiftFilter || ""} 
                onValueChange={(value) => {
                  setShiftFilter(value || null);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por turno" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los turnos</SelectItem>
                  {shifts.map((shift) => (
                    <SelectItem key={shift} value={shift}>{shift}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {(searchTerm || departmentFilter || shiftFilter) && (
                <div className="md:col-span-4 flex justify-end">
                  <Button variant="outline" onClick={resetFilters} size="sm">
                    Quitar todos los filtros
                  </Button>
                </div>
              )}
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
                  {currentWorkers.length > 0 ? (
                    currentWorkers.map(worker => (
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
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 py-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <span className="text-sm">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
