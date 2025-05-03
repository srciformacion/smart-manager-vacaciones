
import React from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { exampleUser } from '@/data/example-users';
import { Card } from '@/components/ui/card';

export default function ChatPage() {
  return (
    <MainLayout user={exampleUser}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mensajes</h1>
          <p className="text-muted-foreground mt-2">
            Centro de mensajes y comunicaciones
          </p>
        </div>
        
        <Card className="p-6">
          <div className="text-center py-10">
            <h2 className="text-xl font-semibold mb-2">Centro de mensajes</h2>
            <p className="text-muted-foreground">
              Esta funcionalidad estará disponible próximamente.
            </p>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
