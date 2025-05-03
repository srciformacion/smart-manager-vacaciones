import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, metadata?: { [key: string]: any }) => Promise<any>;
  signOut: () => Promise<void>;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('worker');
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Only execute additional logic inside setTimeout to prevent deadlocks
        if (currentSession?.user) {
          setTimeout(() => {
            // Get the stored role or default to worker
            const storedRole = localStorage.getItem('userRole') as UserRole || 'worker';
            setUserRole(storedRole);
          }, 0);
        }
      }
    );
    
    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        // Get the stored role or default to worker
        const storedRole = localStorage.getItem('userRole') as UserRole || 'worker';
        setUserRole(storedRole);
      }
      
      setLoading(false);
    }).catch((err) => {
      console.error('Error getting session:', err);
      setError('Error getting session');
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast({
          title: "Error de autenticación",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }

      if (data.user) {
        // Store role in localStorage for consistency
        localStorage.setItem("userRole", userRole);
        localStorage.setItem("userEmail", email);
        
        // Redirect to welcome page instead of dashboard
        setTimeout(() => {
          navigate('/welcome');
        }, 0);
      }

      return data;
    } catch (err) {
      console.error('Sign in error:', err);
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw new Error('Unknown error signing in');
    }
  };

  const signUp = async (email: string, password: string, metadata?: { [key: string]: any }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            ...metadata,
            role: userRole // Store role in user metadata
          }
        }
      });

      if (error) {
        toast({
          title: "Error de registro",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }

      if (data.user) {
        toast({
          title: "Cuenta creada con éxito",
          description: "Ya puedes iniciar sesión con tus credenciales.",
        });
      }

      return data;
    } catch (err) {
      console.error('Sign up error:', err);
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw new Error('Unknown error signing up');
    }
  };

  const signOut = async () => {
    try {
      // Primero limpiar localStorage antes de cerrar sesión en Supabase
      localStorage.removeItem("userRole");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("user");
      
      // Luego cerrar sesión en Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error(`Error al cerrar sesión: ${error.message}`);
        throw error;
      }
      
      // Notificar éxito y redireccionar
      toast.success("Has cerrado la sesión correctamente");
      
      // Usando replace para evitar volver atrás con el botón del navegador
      navigate('/auth', { replace: true });
      
    } catch (err) {
      console.error('Sign out error:', err);
      if (err instanceof Error) {
        toast.error(`Error: ${err.message}`);
      } else {
        toast.error('Error desconocido al cerrar sesión');
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        session, 
        loading, 
        error, 
        signIn, 
        signUp, 
        signOut, 
        userRole, 
        setUserRole 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
