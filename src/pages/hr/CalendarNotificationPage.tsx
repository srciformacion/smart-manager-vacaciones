
import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { NotificationSystem } from "@/components/hr/notifications/NotificationSystem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exampleUser } from "@/data/example-users";
import { NotificationForm } from "@/components/hr/notifications/NotificationForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CalendarNotificationPage() {
  const [activeTab, setActiveTab] = useState("conversations");
  
  return (
    <MainLayout user={exampleUser}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sistema de Notificaciones</h1>
          <p className="text-muted-foreground mt-2">
            Gestione la comunicación con los trabajadores relacionada con calendarios laborales y turnos
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
            <TabsTrigger value="conversations">Conversaciones</TabsTrigger>
            <TabsTrigger value="notifications">Envío de Notificaciones</TabsTrigger>
          </TabsList>
          
          <TabsContent value="conversations" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sistema de conversaciones</CardTitle>
                <CardDescription>
                  Gestione conversaciones con empleados sobre calendarios, vacaciones y turnos
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <NotificationSystem />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-6 space-y-4">
            <NotificationForm />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
