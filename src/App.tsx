
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthProvider } from "@/hooks/use-auth.tsx";
import { ProtectedRoute } from "@/components/auth/protected-route";

// Páginas principales
const Index = lazy(() => import('@/pages/Index'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const AuthPage = lazy(() => import('@/pages/auth/AuthPage'));
const WelcomePage = lazy(() => import('@/pages/auth/WelcomePage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Páginas del Trabajador
const DashboardPage = lazy(() => import('@/pages/worker/DashboardPage'));
const WorkCalendarPage = lazy(() => import('@/pages/worker/WorkCalendarPage'));
const VacationRequestPage = lazy(() => import('@/pages/worker/VacationRequestPage'));
const PersonalDayRequestPage = lazy(() => import('@/pages/worker/PersonalDayRequestPage'));
const LeaveRequestPage = lazy(() => import('@/pages/worker/LeaveRequestPage'));
const ShiftChangeRequestPage = lazy(() => import('@/pages/worker/ShiftChangeRequestPage'));
const HistoryPage = lazy(() => import('@/pages/worker/HistoryPage'));
const ShiftProfilePage = lazy(() => import('@/pages/worker/ShiftProfilePage'));
const ChatPage = lazy(() => import('@/pages/ChatPage'));

// Páginas de RRHH
const HRDashboardPage = lazy(() => import('@/pages/hr/HRDashboardPage'));
const RequestsManagementPage = lazy(() => import('@/pages/hr/RequestsManagementPage'));
const WorkersManagementPage = lazy(() => import('@/pages/hr/WorkersManagementPage'));
const CalendarManagementPage = lazy(() => import('@/pages/hr/CalendarManagementPage'));
const SendNotificationPage = lazy(() => import('@/pages/hr/SendNotificationPage'));
const CalendarNotificationPage = lazy(() => import('@/pages/hr/CalendarNotificationPage'));
const AIAssistantPage = lazy(() => import('@/pages/hr/AIAssistantPage'));
const AIDashboardPage = lazy(() => import('@/pages/hr/AIDashboardPage'));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <div className="w-full max-w-md space-y-4">
      <Skeleton className="h-10 w-[200px]" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<LoginPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

            {/* Nueva ruta para la página de bienvenida */}
            <Route path="/welcome" element={
              <ProtectedRoute>
                <WelcomePage />
              </ProtectedRoute>
            } />

            {/* Rutas de trabajador protegidas */}
            <Route path="/dashboard" element={
              <ProtectedRoute requiredRole="worker">
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/calendar" element={
              <ProtectedRoute requiredRole="worker">
                <WorkCalendarPage />
              </ProtectedRoute>
            } />
            <Route path="/requests/vacation" element={
              <ProtectedRoute requiredRole="worker">
                <VacationRequestPage />
              </ProtectedRoute>
            } />
            <Route path="/requests/personal-day" element={
              <ProtectedRoute requiredRole="worker">
                <PersonalDayRequestPage />
              </ProtectedRoute>
            } />
            <Route path="/requests/leave" element={
              <ProtectedRoute requiredRole="worker">
                <LeaveRequestPage />
              </ProtectedRoute>
            } />
            <Route path="/requests/shift-change" element={
              <ProtectedRoute requiredRole="worker">
                <ShiftChangeRequestPage />
              </ProtectedRoute>
            } />
            <Route path="/history" element={
              <ProtectedRoute requiredRole="worker">
                <HistoryPage />
              </ProtectedRoute>
            } />
            <Route path="/shift-profile" element={
              <ProtectedRoute requiredRole="worker">
                <ShiftProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            } />

            {/* Rutas de RRHH protegidas */}
            <Route path="/rrhh/dashboard" element={
              <ProtectedRoute requiredRole="hr">
                <HRDashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/rrhh/requests" element={
              <ProtectedRoute requiredRole="hr">
                <RequestsManagementPage />
              </ProtectedRoute>
            } />
            <Route path="/rrhh/workers" element={
              <ProtectedRoute requiredRole="hr">
                <WorkersManagementPage />
              </ProtectedRoute>
            } />
            <Route path="/rrhh/calendar" element={
              <ProtectedRoute requiredRole="hr">
                <CalendarManagementPage />
              </ProtectedRoute>
            } />
            <Route path="/rrhh/notification" element={
              <ProtectedRoute requiredRole="hr">
                <SendNotificationPage />
              </ProtectedRoute>
            } />
            <Route path="/rrhh/calendar-notification" element={
              <ProtectedRoute requiredRole="hr">
                <CalendarNotificationPage />
              </ProtectedRoute>
            } />
            <Route path="/rrhh/ai-assistant" element={
              <ProtectedRoute requiredRole="hr">
                <AIAssistantPage />
              </ProtectedRoute>
            } />
            <Route path="/rrhh/ai-dashboard" element={
              <ProtectedRoute requiredRole="hr">
                <AIDashboardPage />
              </ProtectedRoute>
            } />

            {/* Rutas de error */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
