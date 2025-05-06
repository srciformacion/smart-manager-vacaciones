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
const ChatPage = lazy(() => import('@/pages/chat/ChatPage'));
const VacationRequestPage = lazy(() => import('@/pages/worker/VacationRequestPage'));
const PersonalDayRequestPage = lazy(() => import('@/pages/worker/PersonalDayRequestPage'));
const LeaveRequestPage = lazy(() => import('@/pages/worker/LeaveRequestPage'));
const ShiftChangeRequestPage = lazy(() => import('@/pages/worker/ShiftChangeRequestPage'));
const ShiftProfilePage = lazy(() => import('@/pages/worker/ShiftProfilePage'));
const HistoryPage = lazy(() => import('@/pages/worker/HistoryPage'));

// HR pages
const HRDashboardPage = lazy(() => import('@/pages/hr/HRDashboardPage'));
const HRWorkersPage = lazy(() => import('@/pages/hr/HRWorkersPage'));
const HRRequestsPage = lazy(() => import('@/pages/hr/HRRequestsPage'));
const HRCalendarPage = lazy(() => import('@/pages/hr/HRCalendarPage'));
const HRDocumentsPage = lazy(() => import('@/pages/hr/HRDocumentsPage'));
const HRReportsPage = lazy(() => import('@/pages/hr/HRReportsPage'));
const HRSettingsPage = lazy(() => import('@/pages/hr/HRSettingsPage'));
const SmartAssistantPage = lazy(() => import('@/pages/hr/SmartAssistantPage'));
const AIAssistantPage = lazy(() => import('@/pages/hr/AIAssistantPage'));
const AIDashboardPage = lazy(() => import('@/pages/hr/AIDashboardPage'));
const RequestsManagementPage = lazy(() => import('@/pages/hr/RequestsManagementPage'));
const WorkersManagementPage = lazy(() => import('@/pages/hr/WorkersManagementPage'));
const CalendarManagementPage = lazy(() => import('@/pages/hr/CalendarManagementPage'));
const SendNotificationPage = lazy(() => import('@/pages/hr/SendNotificationPage'));

// Other pages
const Index = lazy(() => import('@/pages/Index'));

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Router>
        <AuthProvider>
          <Suspense fallback={<Loader />}>
            <Routes>
              {/* Landing page */}
              <Route path="/" element={<Index />} />
              
              {/* Auth routes */}
              <Route path="/auth" element={<AuthPage />} />
              
              {/* Worker routes */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/calendar" element={<WorkCalendarPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/requests" element={<RequestsPage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/history" element={<HistoryPage />} />
              
              {/* Request creation routes */}
              <Route path="/vacation-request" element={<VacationRequestPage />} />
              <Route path="/personal-day-request" element={<PersonalDayRequestPage />} />
              <Route path="/leave-request" element={<LeaveRequestPage />} />
              <Route path="/shift-change-request" element={<ShiftChangeRequestPage />} />
              <Route path="/shift-profile" element={<ShiftProfilePage />} />
              
              {/* HR routes */}
              <Route path="/rrhh/dashboard" element={<HRDashboardPage />} />
              <Route path="/rrhh/workers" element={<HRWorkersPage />} />
              <Route path="/rrhh/requests" element={<HRRequestsPage />} />
              <Route path="/rrhh/calendar" element={<HRCalendarPage />} />
              <Route path="/rrhh/documents" element={<HRDocumentsPage />} />
              <Route path="/rrhh/reports" element={<HRReportsPage />} />
              <Route path="/rrhh/settings" element={<HRSettingsPage />} />
              <Route path="/rrhh/smart-assistant" element={<SmartAssistantPage />} />
              <Route path="/rrhh/ai-assistant" element={<AIAssistantPage />} />
              <Route path="/rrhh/ai-dashboard" element={<AIDashboardPage />} />
              <Route path="/rrhh/management" element={<RequestsManagementPage />} />
              <Route path="/rrhh/workers-management" element={<WorkersManagementPage />} />
              <Route path="/rrhh/calendar-management" element={<CalendarManagementPage />} />
              <Route path="/rrhh/notifications" element={<SendNotificationPage />} />
              
              {/* Redirect routes */}
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
