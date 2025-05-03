
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";

// Import authentication pages
import LoginPage from './pages/auth/LoginPage';

// Import worker pages
import Index from './pages/Index';
import DashboardPage from './pages/worker/DashboardPage';
import WorkCalendarPage from './pages/worker/WorkCalendarPage';
import VacationRequestPage from './pages/requests/VacationRequestPage';
import LeaveRequestPage from './pages/requests/LeaveRequestPage';
import PersonalDayRequestPage from './pages/requests/PersonalDayRequestPage';
import ShiftChangeRequestPage from './pages/requests/ShiftChangeRequestPage';
import ShiftProfilePage from './pages/worker/ShiftProfilePage';
import HistoryPage from './pages/worker/HistoryPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';

// Import HR pages
import HRDashboardPage from './pages/hr/HRDashboardPage';
import RequestsManagementPage from './pages/hr/RequestsManagementPage';
import WorkersManagementPage from './pages/hr/WorkersManagementPage';
import CalendarManagementPage from './pages/hr/CalendarManagementPage';
import SmartAssistantPage from './pages/hr/SmartAssistantPage';
import AIAssistantPage from './pages/hr/AIAssistantPage';
import SendNotificationPage from './pages/hr/SendNotificationPage';
import CalendarNotificationPage from './pages/hr/CalendarNotificationPage';

// Import common components
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/auth" element={<LoginPage />} />
          <Route path="/login" element={<Navigate to="/auth" replace />} />

          {/* Worker Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/calendario-laboral" element={<WorkCalendarPage />} />
          <Route path="/solicitudes/vacaciones" element={<VacationRequestPage />} />
          <Route path="/solicitudes/permisos" element={<LeaveRequestPage />} />
          <Route path="/solicitudes/asuntos-propios" element={<PersonalDayRequestPage />} />
          <Route path="/solicitudes/cambio-turno" element={<ShiftChangeRequestPage />} />
          <Route path="/perfiles-turno" element={<ShiftProfilePage />} />
          <Route path="/historial" element={<HistoryPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/perfil" element={<ProfilePage />} />

          {/* HR Routes */}
          <Route path="/rrhh/dashboard" element={<HRDashboardPage />} />
          <Route path="/rrhh/solicitudes" element={<RequestsManagementPage />} />
          <Route path="/rrhh/trabajadores" element={<WorkersManagementPage />} />
          <Route path="/rrhh/calendarios" element={<CalendarManagementPage />} />
          <Route path="/rrhh/notificaciones" element={<CalendarNotificationPage />} />
          <Route path="/rrhh/asistente" element={<SmartAssistantPage />} />
          <Route path="/rrhh/ai-assistant" element={<AIAssistantPage />} />
          <Route path="/rrhh/send-notification" element={<SendNotificationPage />} />

          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
};

export default App;
