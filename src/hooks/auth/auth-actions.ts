
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { NavigateFunction } from 'react-router-dom';
import { UserRole } from '@/types';

export async function signIn(
  email: string, 
  password: string, 
  userRole: UserRole,
  navigate: NavigateFunction
) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      toast.error("Error de autenticación: " + error.message);
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
}

export async function signUp(
  email: string, 
  password: string, 
  userRole: UserRole,
  metadata?: { [key: string]: any }
) {
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
      toast.error("Error de registro: " + error.message);
      throw error;
    }

    if (data.user) {
      toast.success("Cuenta creada con éxito. Ya puedes iniciar sesión con tus credenciales.");
    }

    return data;
  } catch (err) {
    console.error('Sign up error:', err);
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw new Error('Unknown error signing up');
  }
}

export async function signOut(navigate: NavigateFunction) {
  try {
    // First clear localStorage to ensure state is reset
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("user");
    
    // Then sign out from Supabase - handle potential errors gracefully
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error(`Error during Supabase signOut:`, error.message);
        // Continue with redirection despite Supabase error
      }
    } catch (err) {
      // Log but don't throw - we still want to complete the local logout
      console.error('Error: Sign out error:', err);
    }
    
    // Success notification
    toast.success("Has cerrado la sesión correctamente");
    
    // Navigate using replace to prevent going back with browser history
    navigate('/auth', { replace: true });
    
  } catch (err) {
    console.error('Sign out complete error:', err);
    toast.error('Error al cerrar sesión');
    // Still redirect to auth page even if there was an error
    navigate('/auth', { replace: true });
  }
}
