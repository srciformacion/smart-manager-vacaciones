
import React from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { RequestForm } from '@/components/requests/request-form';
import { exampleUser } from '@/data/example-users';

export default function PersonalDayRequestPage() {
  // Mock submission function - in a real implementation, this would connect to the database
  const handleSubmit = (values: any, file: File | null) => {
    console.log('Personal day request submitted:', values);
    if (file) {
      console.log('With attachment:', file.name);
    }
  };

  return (
    <MainLayout user={exampleUser}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Solicitud de días por asuntos propios</h1>
          <p className="text-muted-foreground mt-2">
            Complete el formulario para solicitar días por asuntos propios
          </p>
        </div>
        
        <RequestForm 
          requestType="personalDay"
          user={exampleUser}
          onSubmit={handleSubmit}
        />
      </div>
    </MainLayout>
  );
}
