
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from './types';

export const signIn = async (email: string, password: string, userRole?: UserRole) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  // Store user role if provided
  if (userRole && data.user) {
    localStorage.setItem('userRole', userRole);
  }

  return data;
};

export const signUp = async (email: string, password: string, userRole?: UserRole, metadata?: { [key: string]: any }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });

  if (error) throw error;

  // Store user role if provided
  if (userRole && data.user) {
    localStorage.setItem('userRole', userRole);
  }

  return data;
};

export const signOut = async () => {
  // Clear stored user role
  localStorage.removeItem('userRole');
  localStorage.removeItem('user');
  
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
