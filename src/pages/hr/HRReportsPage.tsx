
import React from 'react';
import { MainLayout } from "@/components/layout/main-layout";
import { useProfileAuth } from "@/hooks/profile/useProfileAuth";
import { EnhancedReportsGenerator } from "@/components/hr/reports/enhanced-reports-generator";

export default function HRReportsPage() {
  const { user } = useProfileAuth();
  
  return (
    <MainLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Sistema de Informes</h1>
          <p className="text-muted-foreground">
            Genera informes detallados y personalizados sobre vacaciones, permisos y asistencia
          </p>
        </div>
        
        <EnhancedReportsGenerator />
      </div>
    </MainLayout>
  );
}
