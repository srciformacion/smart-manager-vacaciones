
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Páginas
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Páginas de autenticación
import LoginPage from "./pages/auth/LoginPage";

// Páginas de trabajador
import DashboardPage from "./pages/worker/DashboardPage";
import VacationRequestPage from "./pages/worker/VacationRequestPage";
import PersonalDayRequestPage from "./pages/worker/PersonalDayRequestPage";
import LeaveRequestPage from "./pages/worker/LeaveRequestPage";
import ShiftProfilePage from "./pages/worker/ShiftProfilePage";
import HistoryPage from "./pages/worker/HistoryPage";

// Páginas de RRHH
import HRDashboardPage from "./pages/hr/HRDashboardPage";
import WorkersManagementPage from "./pages/hr/WorkersManagementPage";
import RequestsManagementPage from "./pages/hr/RequestsManagementPage";
import SmartAssistantPage from "./pages/hr/SmartAssistantPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Rutas de trabajador */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/solicitudes/vacaciones" element={<VacationRequestPage />} />
          <Route path="/solicitudes/asuntos-propios" element={<PersonalDayRequestPage />} />
          <Route path="/solicitudes/permisos" element={<LeaveRequestPage />} />
          <Route path="/perfiles-turno" element={<ShiftProfilePage />} />
          <Route path="/historial" element={<HistoryPage />} />
          
          {/* Rutas de RRHH */}
          <Route path="/rrhh/dashboard" element={<HRDashboardPage />} />
          <Route path="/rrhh/trabajadores" element={<WorkersManagementPage />} />
          <Route path="/rrhh/solicitudes" element={<RequestsManagementPage />} />
          <Route path="/rrhh/asistente" element={<SmartAssistantPage />} />
          
          {/* Ruta por defecto */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
