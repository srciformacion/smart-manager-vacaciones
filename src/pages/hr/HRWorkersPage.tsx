
import React from 'react';
import { MainLayout } from "@/components/layout/main-layout";
import { useProfileAuth } from "@/hooks/profile/useProfileAuth";
import { exampleWorkers } from "@/data/example-users";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { WorkersFilters } from "@/components/hr/workers/workers-filters";
import { WorkersTable } from "@/components/hr/workers/workers-table";
import { WorkersPagination } from "@/components/hr/workers/workers-pagination";
import { useWorkersFilter } from "@/hooks/hr/use-workers-filter";
import { Button } from "@/components/ui/button";
import { Users, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export default function HRWorkersPage() {
  const { user } = useProfileAuth();
  
  const {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    departmentFilter,
    setDepartmentFilter,
    shiftFilter,
    setShiftFilter,
    departments,
    shifts,
    filteredWorkers,
    paginatedWorkers,
    totalPages,
    resetFilters,
    showResetButton
  } = useWorkersFilter({ 
    workers: exampleWorkers,
    workersPerPage: 10
  });
  
  console.log("HRWorkersPage rendering with", paginatedWorkers.length, "workers");
  
  return (
    <MainLayout user={user}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Gestión de trabajadores</h1>
            <p className="text-muted-foreground">Administra la información de los {exampleWorkers.length} empleados</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/rrhh/workers-management" className="flex items-center gap-2">
                <Settings size={16} />
                <span>Gestión avanzada</span>
              </Link>
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Lista de trabajadores</CardTitle>
            <CardDescription>
              {filteredWorkers.length} de {exampleWorkers.length} trabajadores mostrados
            </CardDescription>
            
            <WorkersFilters 
              searchTerm={searchTerm}
              setSearchTerm={(value) => {
                setSearchTerm(value);
                setCurrentPage(1);
              }}
              departmentFilter={departmentFilter}
              setDepartmentFilter={(value) => {
                setDepartmentFilter(value);
                setCurrentPage(1);
              }}
              shiftFilter={shiftFilter}
              setShiftFilter={(value) => {
                setShiftFilter(value);
                setCurrentPage(1);
              }}
              departments={departments}
              shifts={shifts}
              resetFilters={resetFilters}
              showResetButton={!!showResetButton}
              totalWorkers={exampleWorkers.length}
              filteredCount={filteredWorkers.length}
            />
          </CardHeader>
          
          <CardContent>
            <WorkersTable workers={paginatedWorkers} />
            
            <WorkersPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
