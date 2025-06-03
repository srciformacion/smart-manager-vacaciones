
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

export function HRRequestsLoading() {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Cargando solicitudes...</p>
        </div>
      </CardContent>
    </Card>
  );
}
