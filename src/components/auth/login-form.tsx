
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Esquema de validación para el formulario
const formSchema = z.object({
  email: z.string().email({
    message: "Por favor, introduce un email válido",
  }),
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres",
  }),
});

interface LoginFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isSubmitting?: boolean;
  error?: string;
  mode: "login" | "register";
  onToggleMode: () => void;
}

export function LoginForm({ onSubmit, isSubmitting = false, error, mode, onToggleMode }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  // Inicializar formulario
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await onSubmit(values);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message
        });
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg animate-in fade-in-50 duration-300">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
        </CardTitle>
        <CardDescription>
          {mode === "login" 
            ? "Inicia sesión para acceder a la plataforma de gestión de vacaciones" 
            : "Crea una cuenta para comenzar a usar la plataforma"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm mb-4 animate-in slide-in-from-top duration-200">
                {error}
              </div>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ejemplo@empresa.com"
                      type="email"
                      disabled={isSubmitting}
                      className="transition-all duration-200 focus:ring-2"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>Contraseña</FormLabel>
                    {mode === "login" && (
                      <Link to="/auth/reset-password" className="text-xs text-primary hover:underline">
                        ¿Olvidaste tu contraseña?
                      </Link>
                    )}
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Contraseña"
                        type={showPassword ? "text" : "password"}
                        disabled={isSubmitting}
                        className="pr-10 transition-all duration-200 focus:ring-2"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full transition-all duration-200 hover:opacity-90" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-pulse mr-2">●</span> 
                  {mode === "login" ? "Iniciando sesión..." : "Creando cuenta..."}
                </>
              ) : (
                mode === "login" ? "Iniciar sesión" : "Crear cuenta"
              )}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center">
          <Button
            variant="link"
            onClick={onToggleMode}
            className="text-sm text-primary"
          >
            {mode === "login" ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <p className="text-sm text-muted-foreground">
          Si tienes problemas para acceder, contacta con el administrador
        </p>
        <div className="text-xs text-muted-foreground mt-2">
          Versión 1.0.0 • La Rioja Cuida © 2025
        </div>
      </CardFooter>
    </Card>
  );
}
