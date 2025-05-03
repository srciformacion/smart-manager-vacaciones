
import React from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { RequestForm } from '@/components/requests/request-form';
import { exampleUser } from '@/data/example-users';

export default function PersonalDayRequestPage() {
  return (
    <MainLayout user={exampleUser}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Solicitud de días por asuntos propios</h1>
          <p className="text-muted-foreground mt-2">
            Complete el formulario para solicitar días por asuntos propios
          </p>
        </div>
        
        <RequestForm type="personal" />
      </div>
    </MainLayout>
  );
}
