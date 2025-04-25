
import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { CalendarManagement } from "@/components/hr/calendar/calendar-management";
import { CalendarExcelImport } from "@/components/hr/calendar/calendar-excel-import";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exampleUser, exampleWorkers } from "@/data/example-users";
import { exampleShifts, generateMonthlyShifts } from "@/data/calendar/shifts";

export default function CalendarManagementPage() {
  const [user] = useState(exampleUser);
  const [activeTab, setActiveTab] = useState("calendar");
  
  // Get example shifts for the current month
  const currentDate = new Date();
  const currentMonthShifts = generateMonthlyShifts(
    "1", // Default to Ana Martínez
    currentDate.getFullYear(),
    currentDate.getMonth() + 1
  );

  return (
    <MainLayout user={user}>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestión de calendarios y turnos</h1>
            <p className="text-muted-foreground mt-2">
              Administre los calendarios laborales y turnos del personal
            </p>
          </div>
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="calendar">Calendario</TabsTrigger>
            <TabsTrigger value="excel">Importar/Exportar Excel</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar">
            <CalendarManagement workers={exampleWorkers} />
          </TabsContent>
          
          <TabsContent value="excel">
            <CalendarExcelImport 
              users={exampleWorkers} 
              existingShifts={exampleShifts} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
