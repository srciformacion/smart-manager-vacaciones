
import React from 'react';
import { MainLayout } from "@/components/layout/main-layout";
import { useProfileAuth } from "@/hooks/profile/useProfileAuth";
import { exampleWorkers } from "@/data/example-users";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { WorkersFilters } from "@/components/hr/workers/workers-filters";
import { WorkersTable } from "@/components/hr/workers/workers-table";
import { WorkersPagination } from "@/components/hr/workers/workers-pagination";
import { useWorkersFilter } from "@/hooks/hr/use-workers-filter";

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
              showResetButton={showResetButton}
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
