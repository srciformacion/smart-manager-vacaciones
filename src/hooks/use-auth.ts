
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';
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
        
        // Navigate based on role
        setTimeout(() => {
          if (userRole === "hr") {
            navigate('/rrhh/dashboard');
          } else {
            navigate('/dashboard');
          }
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
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Error al cerrar sesión",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      
      // Clear localStorage
      localStorage.removeItem("userRole");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("user");
      
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado la sesión correctamente"
      });
      
      navigate('/auth');
      
    } catch (err) {
      console.error('Sign out error:', err);
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw new Error('Unknown error signing out');
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
