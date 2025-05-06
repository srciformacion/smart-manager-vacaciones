
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AuthProvider } from "@/hooks/auth/auth-provider"; // Import directly from the source
import { Suspense, lazy } from "react";
import { Loader } from "@/components/ui/loader";

// Lazy-loaded pages
const AuthPage = lazy(() => import('@/pages/auth/AuthPage'));
const DashboardPage = lazy(() => import('@/pages/worker/DashboardPage'));
const WorkCalendarPage = lazy(() => import('@/pages/worker/WorkCalendarPage'));
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'));
const RequestsPage = lazy(() => import('@/pages/worker/RequestsPage'));
const DocumentsPage = lazy(() => import('@/pages/worker/DocumentsPage'));
const HRDashboardPage = lazy(() => import('@/pages/hr/HRDashboardPage'));
const HRWorkersPage = lazy(() => import('@/pages/hr/HRWorkersPage'));
const HRRequestsPage = lazy(() => import('@/pages/hr/HRRequestsPage'));
const HRCalendarPage = lazy(() => import('@/pages/hr/HRCalendarPage'));
const HRDocumentsPage = lazy(() => import('@/pages/hr/HRDocumentsPage'));
const HRReportsPage = lazy(() => import('@/pages/hr/HRReportsPage'));
const HRSettingsPage = lazy(() => import('@/pages/hr/HRSettingsPage'));
const ChatPage = lazy(() => import('@/pages/chat/ChatPage'));

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Router>
        <AuthProvider>
          <Suspense fallback={<Loader />}>
            <Routes>
              {/* Auth routes */}
              <Route path="/auth" element={<AuthPage />} />
              
              {/* Worker routes */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/calendar" element={<WorkCalendarPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/requests" element={<RequestsPage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              
              {/* HR routes */}
              <Route path="/rrhh/dashboard" element={<HRDashboardPage />} />
              <Route path="/rrhh/workers" element={<HRWorkersPage />} />
              <Route path="/rrhh/requests" element={<HRRequestsPage />} />
              <Route path="/rrhh/calendar" element={<HRCalendarPage />} />
              <Route path="/rrhh/documents" element={<HRDocumentsPage />} />
              <Route path="/rrhh/reports" element={<HRReportsPage />} />
              <Route path="/rrhh/settings" element={<HRSettingsPage />} />
              
              {/* Chat route */}
              <Route path="/chat" element={<ChatPage />} />
              
              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
          <Toaster />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
