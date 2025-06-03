import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme/theme-toggle";

// Demo users for testing
const DEMO_USERS = [{
  email: "usuario@example.com",
  password: "password",
  role: "worker"
}, {
  email: "rrhh@example.com",
  password: "password",
  role: "hr"
}];
export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("worker");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on component mount
  useEffect(() => {
    const checkSession = () => {
      const user = localStorage.getItem("user");
      if (user) {
        // If there's an active session, redirect based on stored role
        const storedRole = localStorage.getItem("userRole") as UserRole || "worker";
        console.log("Found existing session, redirecting to", storedRole === "hr" ? "/rrhh/dashboard" : "/dashboard");
        if (storedRole === "hr") {
          navigate("/rrhh/dashboard");
        } else {
          navigate("/dashboard");
        }
      }
      setLoading(false);
    };
    checkSession();
  }, [navigate]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Find the user in our demo users array - verificamos la coincidencia exacta
      const user = DEMO_USERS.find(u => u.email === email && u.password === password);
      if (!user) {
        throw new Error("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
      }

      // Usamos el rol del usuario encontrado
      const role = user.role as UserRole;

      // Create a user object with necessary fields
      const userData = {
        id: `demo-${Date.now().toString()}`,
        name: role === "hr" ? "Administrador RRHH" : "Usuario Demo",
        email: user.email,
        user_metadata: {
          role
        },
        role: role
      };

      // Store auth info in localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("userRole", role);
      localStorage.setItem("userEmail", email);

      // Dispatch storage event to notify other tabs
      window.dispatchEvent(new Event("storage"));

      // Mostramos el rol con el que se ha iniciado sesión
      toast.success(`Has iniciado sesión como ${role === "hr" ? "RRHH" : "Trabajador"}`);

      // Redirect based on role
      if (role === "hr") {
        navigate("/rrhh/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast.error(`Error al iniciar sesión: ${error.message || "Ha ocurrido un error durante el inicio de sesión"}`);
      console.error("Auth error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>;
  }
  return <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4 flex gap-2">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">La Rioja Cuida </h1>
          <p className="mt-2 text-muted-foreground">Sistema de gestión completo de Ho</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-primary mb-6">Iniciar sesión</h2>
          </div>

          <div className="space-y-2">
            <Label>Tipo de usuario</Label>
            <RadioGroup value={userRole} onValueChange={value => setUserRole(value as UserRole)} className="flex gap-6">
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

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
            {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>

          <div className="flex justify-between text-sm">
            <Link to="/auth/register" className="text-primary hover:underline">
              Registrarse
            </Link>
            <Link to="/auth/reset-password" className="text-primary hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </form>
        
        <div className="mt-6 text-sm text-center text-muted-foreground">
          <p>Credenciales de demo:</p>
          <p>Usuario: usuario@example.com / Contraseña: password</p>
          <p>RRHH: rrhh@example.com / Contraseña: password</p>
        </div>

        <div className="mt-6 text-center">
          <Button variant="outline" className="w-full" onClick={() => {
          // Create user data
          const userData = {
            id: `demo-${Date.now().toString()}`,
            name: userRole === "hr" ? "Administrador RRHH" : "Usuario Demo",
            email: userRole === "hr" ? "rrhh@example.com" : "usuario@example.com",
            user_metadata: {
              role: userRole
            },
            role: userRole
          };

          // Store auth info
          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("userRole", userRole);
          localStorage.setItem("userEmail", userData.email);
          toast.success(`Has iniciado sesión como ${userRole === "hr" ? "RRHH" : "Trabajador"} en modo demo`);

          // Redirect based on role
          if (userRole === "hr") {
            navigate("/rrhh/dashboard");
          } else {
            navigate("/dashboard");
          }
        }}>
            Entrar con credenciales de prueba
          </Button>
        </div>
        
        <div className="mt-4 text-xs text-center text-muted-foreground">
          <p>Versión 1.1.0 • Smart Vacancy © 2025</p>
        </div>
      </div>
    </div>;
}