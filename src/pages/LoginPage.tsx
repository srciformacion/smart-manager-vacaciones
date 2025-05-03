
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would validate credentials
    // For now, just navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Sistema de Gestión Laboral</h1>
          <p className="text-muted-foreground mt-2">Iniciar sesión</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Acceso de usuario</CardTitle>
            <CardDescription>
              Introduzca sus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="usuario@empresa.com" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Iniciar sesión
              </Button>
            </form>
            <div className="text-center mt-4">
              <Button 
                variant="link" 
                className="text-sm" 
                onClick={() => navigate('/auth')}
              >
                Volver
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
