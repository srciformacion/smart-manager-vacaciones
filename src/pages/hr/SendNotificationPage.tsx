
import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { User } from "@/types";
import { NotificationForm } from "@/components/hr/notifications/NotificationForm";

export default function SendNotificationPage() {
  const [user, setUser] = useState<User | null>(() => {
    const userJson = localStorage.getItem("user");
    return userJson ? JSON.parse(userJson) : null;
  });

  return (
    <MainLayout user={user}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Envío de notificaciones</h1>
            <p className="text-muted-foreground mt-2">
              Gestiona el envío de notificaciones a trabajadores a través de diferentes canales
            </p>
          </div>
        </div>

        <NotificationForm />
      </div>
    </MainLayout>
  );
}
