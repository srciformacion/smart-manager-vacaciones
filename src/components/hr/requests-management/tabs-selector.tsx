
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabsSelectorProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  tabs: { value: string; label: string }[];
}

export function TabsSelector({ activeTab, setActiveTab, tabs }: TabsSelectorProps) {
  return (
    <TabsList className="grid" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
      {tabs.map((tab) => (
        <TabsTrigger key={tab.value} value={tab.value}>
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
