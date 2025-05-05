
import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Header } from "@/components/hr/requests-management/header";
import { TabsManager } from "@/components/hr/requests-management/tabs-manager";
import { useAuth } from "@/hooks/use-auth";
import { User } from "@/types";

export function RequestsManagementPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();

  // Handler for date changes
  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  // Handler for search term changes
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <MainLayout user={user as unknown as User}>
      <div className="space-y-4">
        <Header
          onDateChange={handleDateChange}
          onSearchChange={handleSearchChange}
          selectedDate={selectedDate}
          searchTerm={searchTerm}
        />

        <TabsManager 
          searchTerm={searchTerm}
          selectedDate={selectedDate}
        />
      </div>
    </MainLayout>
  );
}

export default RequestsManagementPage;
