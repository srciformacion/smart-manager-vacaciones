
import React from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { ShiftChangeForm } from '@/components/requests/shift-change-form';
import { exampleUser, exampleWorkers } from '@/data/example-users';

export default function ShiftChangeRequestPage() {
  // Filter out the current user from coworkers
  const coworkers = exampleWorkers.filter(worker => worker.id !== exampleUser.id);

  // Mock submission function - in a real implementation, this would connect to the database
  const handleSubmit = (values: any) => {
    console.log('Shift change request submitted:', values);
  };

  return (
    <MainLayout user={exampleUser}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Solicitud de cambio de turno</h1>
          <p className="text-muted-foreground mt-2">
            Complete el formulario para solicitar un cambio en su turno asignado
          </p>
        </div>
        
        <ShiftChangeForm 
          user={exampleUser}
          coworkers={coworkers}
          onSubmit={handleSubmit}
        />
      </div>
    </MainLayout>
  );
}
