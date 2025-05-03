
import React from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { RequestForm } from '@/components/requests/request-form';
import { exampleUser } from '@/data/example-users';

export default function VacationRequestPage() {
  return (
    <MainLayout user={exampleUser}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Solicitud de vacaciones</h1>
          <p className="text-muted-foreground mt-2">
            Complete el formulario para solicitar sus días de vacaciones
          </p>
        </div>
        
        <RequestForm type="vacation" />
      </div>
    </MainLayout>
  );
}
