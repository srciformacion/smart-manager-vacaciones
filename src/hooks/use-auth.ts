
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if there's an authenticated user when loading the component
    const getUser = async () => {
      setLoading(true);
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        setUser(session?.user || null);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Unknown error getting session');
        }
        console.error('Auth error:', err);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
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
          data: metadata
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
      
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado la sesión correctamente"
      });
      
    } catch (err) {
      console.error('Sign out error:', err);
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw new Error('Unknown error signing out');
    }
  };

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut
  };
};
