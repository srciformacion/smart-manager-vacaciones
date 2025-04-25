import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type AuthMode = "login" | "signup" | "passwordReset" | "passwordResetSent";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [userRole, setUserRole] = useState<"worker" | "hr">("worker");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (authMode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              surname,
              role: userRole,
            },
          },
        });
        if (error) throw error;
        toast({
          title: "Registro exitoso",
          description: "Por favor revisa tu email para confirmar tu cuenta.",
        });
        setAuthMode("login");
      } else if (authMode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        localStorage.setItem('userRole', userRole);
        
        if (userRole === "hr") {
          navigate("/rrhh/dashboard");
        } else {
          navigate("/dashboard");
        }
      } else if (authMode === "passwordReset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth?mode=updatePassword`,
        });
        if (error) throw error;
        setAuthMode("passwordResetSent");
        toast({
          title: "Correo enviado",
          description: "Por favor revisa tu email para restablecer tu contraseña.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderRoleSelector = () => (
    <div className="space-y-2 mb-4">
      <Label>Tipo de usuario</Label>
      <RadioGroup 
        value={userRole} 
        onValueChange={(value) => setUserRole(value as "worker" | "hr")}
        className="flex space-x-4"
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
  );

  const renderLoginForm = () => (
    <>
      {renderRoleSelector()}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="tu@email.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Procesando..." : "Iniciar sesión"}
      </Button>

      <div className="flex justify-between items-center text-sm">
        <Button
          variant="link"
          className="p-0 h-auto"
          onClick={() => setAuthMode("signup")}
        >
          Registrarse
        </Button>
        <Button
          variant="link"
          className="p-0 h-auto"
          onClick={() => setAuthMode("passwordReset")}
        >
          ¿Olvidaste tu contraseña?
        </Button>
      </div>
    </>
  );

  const renderSignUpForm = () => (
    <>
      {renderRoleSelector()}
      
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="tu@email.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Tu nombre"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="surname">Apellidos</Label>
        <Input
          id="surname"
          type="text"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          required
          placeholder="Tus apellidos"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-password">Contraseña</Label>
        <Input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Procesando..." : "Crear cuenta"}
      </Button>

      <div className="text-center">
        <Button
          variant="link"
          className="p-0 h-auto"
          onClick={() => setAuthMode("login")}
        >
          ¿Ya tienes cuenta? Inicia sesión
        </Button>
      </div>
    </>
  );

  const renderPasswordResetForm = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="reset-email">Email</Label>
        <Input
          id="reset-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="tu@email.com"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Procesando..." : "Enviar instrucciones"}
      </Button>

      <div className="text-center">
        <Button
          variant="link"
          className="p-0 h-auto"
          onClick={() => setAuthMode("login")}
        >
          Volver a inicio de sesión
        </Button>
      </div>
    </>
  );

  const renderPasswordResetSent = () => (
    <>
      <div className="text-center py-4">
        <h3 className="text-lg font-medium">Correo enviado</h3>
        <p className="mt-2 text-muted-foreground">
          Revisa tu bandeja de entrada para encontrar el enlace de recuperación de contraseña.
        </p>
      </div>

      <Button
        className="w-full"
        onClick={() => setAuthMode("login")}
      >
        Volver a inicio de sesión
      </Button>
    </>
  );

  const getFormTitle = () => {
    switch (authMode) {
      case "login":
        return "Iniciar sesión";
      case "signup":
        return "Crear cuenta";
      case "passwordReset":
        return "Recuperar contraseña";
      case "passwordResetSent":
        return "Correo enviado";
      default:
        return "La Rioja Cuida";
    }
  };

  const renderForm = () => {
    switch (authMode) {
      case "login":
        return renderLoginForm();
      case "signup":
        return renderSignUpForm();
      case "passwordReset":
        return renderPasswordResetForm();
      case "passwordResetSent":
        return renderPasswordResetSent();
      default:
        return renderLoginForm();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">La Rioja Cuida</h1>
          <p className="mt-2 text-muted-foreground">
            Sistema de gestión de vacaciones y permisos
          </p>
        </div>

        <h2 className="text-2xl font-semibold text-center mb-6">{getFormTitle()}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {renderForm()}
        </form>
      </Card>
    </div>
  );
}
