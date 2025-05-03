
import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkCalendar } from "@/hooks/worker/use-work-calendar";
import { useProfileAuth } from "@/hooks/profile/useProfileAuth";
import { WorkCalendarHeader } from "@/components/worker/calendar/work-calendar-header";
import { HoursSummary } from "@/components/worker/calendar/hours-summary";
import { MonthCalendar } from "@/components/worker/calendar/month-calendar";
import { CorrectionRequest } from "@/components/worker/calendar/correction-request";
import { ExportForm } from "@/components/worker/calendar/export-form";
import { CalendarSync } from "@/components/worker/calendar/calendar-sync";
import { exampleUser } from "@/data/example-users";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function WorkCalendarPage() {
  const { user, fetchAuthUser } = useProfileAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // Initialize calendar hook
  const {
    currentDate,
    shifts,
    annualHours,
    isLoading,
    nextMonth,
    previousMonth,
    selectDate,
    navigate: navigateCalendar,
    calculateMonthStats,
    calculateAnnualStats,
    exportData
  } = useWorkCalendar(user?.id || "1");
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authUser = await fetchAuthUser();
        if (!authUser) {
          toast.error("Por favor inicia sesión para acceder a tu calendario");
          navigate('/auth');
        }
        setLoading(false);
      } catch (error) {
        console.error("Auth check error:", error);
        toast.error("Error al verificar autenticación");
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [fetchAuthUser, navigate]);

  // Example data for vacation days
  const vacationDays = {
    used: 10,
    total: 22
  };

  // Monthly and annual statistics
  const monthStats = calculateMonthStats();
  const annualStats = calculateAnnualStats();
  
  if (loading || isLoading) {
    return (
      <MainLayout user={exampleUser}>
        <div className="space-y-6">
          <Skeleton className="h-10 w-[250px]" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-[400px]" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout user={user || exampleUser}>
      <div className="space-y-6">
        <WorkCalendarHeader
          currentDate={currentDate}
          onPreviousMonth={previousMonth}
          onNextMonth={nextMonth}
          onDateSelect={selectDate}
          onExport={exportData}
          onNavigate={navigateCalendar}
        />

        <HoursSummary
          monthStats={monthStats}
          annualStats={annualStats}
          vacationDays={vacationDays}
        />

        <MonthCalendar
          currentDate={currentDate}
          shifts={shifts}
        />

        <Tabs defaultValue="corrections" className="mt-8">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="corrections">Solicitar corrección</TabsTrigger>
            <TabsTrigger value="export">Exportar</TabsTrigger>
            <TabsTrigger value="sync">Sincronización</TabsTrigger>
          </TabsList>
          <TabsContent value="corrections" className="mt-0">
            <CorrectionRequest />
          </TabsContent>
          <TabsContent value="export" className="mt-0">
            <ExportForm />
          </TabsContent>
          <TabsContent value="sync" className="mt-0">
            <CalendarSync />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
