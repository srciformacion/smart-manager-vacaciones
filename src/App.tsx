
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Páginas
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/auth/AuthPage";
import RoleSelectorPage from "./pages/auth/RoleSelectorPage";

// Páginas de trabajador
import DashboardPage from "./pages/worker/DashboardPage";
import VacationRequestPage from "./pages/worker/VacationRequestPage";
import PersonalDayRequestPage from "./pages/worker/PersonalDayRequestPage";
import LeaveRequestPage from "./pages/worker/LeaveRequestPage";
import ShiftProfilePage from "./pages/worker/ShiftProfilePage";
import HistoryPage from "./pages/worker/HistoryPage";
import ShiftChangeRequestPage from "./pages/worker/ShiftChangeRequestPage";

// Páginas de RRHH
import HRDashboardPage from "./pages/hr/HRDashboardPage";
import WorkersManagementPage from "./pages/hr/WorkersManagementPage";
import RequestsManagementPage from "./pages/hr/RequestsManagementPage";
import SmartAssistantPage from "./pages/hr/SmartAssistantPage";
import HRManagementPage from "./pages/hr/HR-management-page";
import CalendarManagementPage from "./pages/hr/CalendarManagementPage";

// Páginas adicionales
import ProfilePage from "./pages/ProfilePage";
import ChatPage from "./pages/chat/index";

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (session === null) {
    return null; // Loading state
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/roles" element={<RoleSelectorPage />} />
            
            {/* Rutas de trabajador */}
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/solicitudes/vacaciones" element={<PrivateRoute><VacationRequestPage /></PrivateRoute>} />
            <Route path="/solicitudes/asuntos-propios" element={<PrivateRoute><PersonalDayRequestPage /></PrivateRoute>} />
            <Route path="/solicitudes/permisos" element={<PrivateRoute><LeaveRequestPage /></PrivateRoute>} />
            <Route path="/solicitudes/cambio-turno" element={<PrivateRoute><ShiftChangeRequestPage /></PrivateRoute>} />
            <Route path="/perfiles-turno" element={<PrivateRoute><ShiftProfilePage /></PrivateRoute>} />
            <Route path="/historial" element={<PrivateRoute><HistoryPage /></PrivateRoute>} />
            
            {/* Rutas de RRHH */}
            <Route path="/rrhh/dashboard" element={<PrivateRoute><HRDashboardPage /></PrivateRoute>} />
            <Route path="/rrhh/trabajadores" element={<PrivateRoute><WorkersManagementPage /></PrivateRoute>} />
            <Route path="/rrhh/solicitudes" element={<PrivateRoute><RequestsManagementPage /></PrivateRoute>} />
            <Route path="/rrhh/gestion" element={<PrivateRoute><HRManagementPage /></PrivateRoute>} />
            <Route path="/rrhh/calendarios" element={<PrivateRoute><CalendarManagementPage /></PrivateRoute>} />
            <Route path="/rrhh/asistente" element={<PrivateRoute><SmartAssistantPage /></PrivateRoute>} />
            
            {/* Páginas adicionales */}
            <Route path="/perfil" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="/chat" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
