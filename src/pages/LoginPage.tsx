
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserRole } from "@/types";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("worker");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulación para demostración
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set the selected role
      localStorage.setItem("userRole", userRole);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("user", JSON.stringify({ email, id: `user-${Date.now()}` }));
      
      // Navigate based on selected role
      if (userRole === "hr") {
        navigate("/rrhh/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Error de inicio de sesión:", err);
      toast({
        variant: "destructive",
        title: "Error de inicio de sesión",
        description: "Credenciales incorrectas. Por favor, inténtelo de nuevo."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img
            src="/placeholder.svg"
            alt="VacaySmart Logo"
            className="mx-auto h-12 w-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-primary">VacaySmart</h1>
          <p className="mt-2 text-muted-foreground">
            Sistema inteligente de gestión de vacaciones y permisos
          </p>
        </div>
        
        <div className="mb-6">
          <Label className="text-center block mb-2">Seleccione su rol</Label>
          <RadioGroup 
            value={userRole} 
            onValueChange={(value) => setUserRole(value as UserRole)}
            className="flex justify-center space-x-8"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="worker" id="worker" />
              <Label htmlFor="worker">Trabajador</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hr" id="hr" />
              <Label htmlFor="hr">RRHH</Label>
            </div>
          </RadioGroup>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            ¿Quieres probar la aplicación sin crear una cuenta?
          </p>
          <Button variant="outline" asChild>
            <Link to="/auth">Acceder con rol de demostración</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
