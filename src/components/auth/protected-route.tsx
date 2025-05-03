
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth.tsx";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'worker' | 'hr';
}

export const ProtectedRoute = ({ 
  children,
  requiredRole 
}: ProtectedRouteProps) => {
  const { user, loading, userRole } = useAuth();
  const location = useLocation();
  const [initialLoad, setInitialLoad] = useState(true);

  // After initial auth check, remove loading state
  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        setInitialLoad(false);
      }, 500);
    }
  }, [loading]);

  // For debugging
  useEffect(() => {
    console.log("ProtectedRoute - User:", user);
    console.log("ProtectedRoute - Role:", userRole);
    console.log("ProtectedRoute - Required Role:", requiredRole);
  }, [user, userRole, requiredRole]);

  // While we're checking authentication status, show loading
  if (loading || initialLoad) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  // Check for localStorage user in demo mode if no authenticated user
  if (!user) {
    const userJson = localStorage.getItem("user");
    const storedRole = localStorage.getItem("userRole");
    
    if (userJson && storedRole) {
      console.log("Demo user found in localStorage:", storedRole);
      
      // Check if user is trying to access a route that requires a specific role
      if (requiredRole && storedRole !== requiredRole) {
        console.log("Demo user role mismatch:", storedRole, "vs required:", requiredRole);
        if (storedRole === 'hr') {
          return <Navigate to="/rrhh/dashboard" replace />;
        } else {
          return <Navigate to="/dashboard" replace />;
        }
      }
      
      // User is in demo mode and has correct role
      return <>{children}</>;
    }
    
    // No user found, redirect to login
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If role check is required and user doesn't have the required role
  if (requiredRole && userRole !== requiredRole) {
    console.log("Authenticated user role mismatch:", userRole, "vs required:", requiredRole);
    if (userRole === 'hr') {
      return <Navigate to="/rrhh/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // User is authenticated and has the required role
  return <>{children}</>;
};
