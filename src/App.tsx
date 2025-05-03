
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/auth/AuthPage";

// Worker pages
import DashboardPage from "./pages/worker/DashboardPage";
import VacationRequestPage from "./pages/worker/VacationRequestPage";
import PersonalDayRequestPage from "./pages/worker/PersonalDayRequestPage";
import LeaveRequestPage from "./pages/worker/LeaveRequestPage";
import ShiftProfilePage from "./pages/worker/ShiftProfilePage";
import HistoryPage from "./pages/worker/HistoryPage";
import ShiftChangeRequestPage from "./pages/worker/ShiftChangeRequestPage";

// HR pages
import HRDashboardPage from "./pages/hr/HRDashboardPage";
import WorkersManagementPage from "./pages/hr/WorkersManagementPage";
import RequestsManagementPage from "./pages/hr/RequestsManagementPage";
import SmartAssistantPage from "./pages/hr/SmartAssistantPage";
import HRManagementPage from "./pages/hr/HR-management-page";
import CalendarManagementPage from "./pages/hr/CalendarManagementPage";
import AIAssistantPage from "@/pages/hr/AIAssistantPage";
import AIDashboardPage from "@/pages/hr/AIDashboardPage";
import SendNotificationPage from "@/pages/hr/SendNotificationPage";

// Additional pages
import ProfilePage from "./pages/ProfilePage";
import ChatPage from "./pages/chat";

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem("user");
      setIsAuthenticated(!!user);
    };

    checkAuth();
    
    // Set up an event listener for storage changes
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003366]"></div>
      </div>
    ); // Loading state
  }

  if (!isAuthenticated) {
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
            
            {/* Worker routes */}
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/solicitudes/vacaciones" element={<PrivateRoute><VacationRequestPage /></PrivateRoute>} />
            <Route path="/solicitudes/asuntos-propios" element={<PrivateRoute><PersonalDayRequestPage /></PrivateRoute>} />
            <Route path="/solicitudes/permisos" element={<PrivateRoute><LeaveRequestPage /></PrivateRoute>} />
            <Route path="/solicitudes/cambio-turno" element={<PrivateRoute><ShiftChangeRequestPage /></PrivateRoute>} />
            <Route path="/perfiles-turno" element={<PrivateRoute><ShiftProfilePage /></PrivateRoute>} />
            <Route path="/historial" element={<PrivateRoute><HistoryPage /></PrivateRoute>} />
            
            {/* HR routes */}
            <Route path="/rrhh/dashboard" element={<PrivateRoute><HRDashboardPage /></PrivateRoute>} />
            <Route path="/rrhh/trabajadores" element={<PrivateRoute><WorkersManagementPage /></PrivateRoute>} />
            <Route path="/rrhh/solicitudes" element={<PrivateRoute><RequestsManagementPage /></PrivateRoute>} />
            <Route path="/rrhh/asistente" element={<PrivateRoute><SmartAssistantPage /></PrivateRoute>} />
            <Route path="/rrhh/gestion" element={<PrivateRoute><HRManagementPage /></PrivateRoute>} />
            <Route path="/rrhh/calendarios" element={<PrivateRoute><CalendarManagementPage /></PrivateRoute>} />
            <Route path="/rrhh/ai-assistant" element={<PrivateRoute><AIAssistantPage /></PrivateRoute>} />
            <Route path="/rrhh/ai-dashboard" element={<PrivateRoute><AIDashboardPage /></PrivateRoute>} />
            <Route path="/rrhh/notificaciones" element={<PrivateRoute><SendNotificationPage /></PrivateRoute>} />
            
            {/* Chat page - just one route */}
            <Route path="/chat" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
            
            {/* Additional pages */}
            <Route path="/perfil" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
