
import React from 'react';

interface HRRequestsHeaderProps {
  loading: boolean;
  error: string | null;
  pendingApprovalsCount: number;
}

export function HRRequestsHeader({ loading, error, pendingApprovalsCount }: HRRequestsHeaderProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gestión de solicitudes</h1>
      <p className="text-muted-foreground">Administra las solicitudes de los empleados con flujos de aprobación</p>
    </div>
  );
}
