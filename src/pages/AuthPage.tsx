
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Sistema de Gestión Laboral</h1>
          <p className="text-muted-foreground mt-2">Autenticación de usuario</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Iniciar sesión</CardTitle>
            <CardDescription>
              Acceda a su cuenta para gestionar solicitudes y calendarios
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full" 
              onClick={() => navigate('/login')}
            >
              Iniciar sesión
            </Button>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                ¿No tiene una cuenta? Contacte con su departamento de RRHH
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
