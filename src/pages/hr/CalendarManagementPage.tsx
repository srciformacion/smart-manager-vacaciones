
import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { CalendarManagement } from "@/components/hr/calendar/calendar-management";
import { exampleUser, exampleWorkers } from "@/data/example-users";

export default function CalendarManagementPage() {
  const [user] = useState(exampleUser);

  return (
    <MainLayout user={user}>
      <CalendarManagement workers={exampleWorkers} />
    </MainLayout>
  );
}
