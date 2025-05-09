
import { User } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent 
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useMemo } from "react";

interface WorkerDistributionProps {
  title: string;
  workers: User[];
  groupBy: "department" | "shift" | "workGroup" | "workday";
  className?: string;
}

export function WorkerDistributionWidget({
  title,
  workers,
  groupBy,
  className
}: WorkerDistributionProps) {
  const data = useMemo(() => {
    const counts: Record<string, number> = {};
    
    workers.forEach(worker => {
      const key = worker[groupBy] || "Unassigned";
      counts[key] = (counts[key] || 0) + 1;
    });
    
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value
    }));
  }, [workers, groupBy]);

  const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#a4de6c", 
    "#d0ed57", "#ffc658", "#8884d8", "#83a6ed", "#8dd1e1"
  ];

  const config = data.reduce((acc, item, index) => {
    acc[item.name] = { 
      label: item.name,
      color: COLORS[index % COLORS.length]
    };
    return acc;
  }, {} as Record<string, { label: string, color: string }>);

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[240px] w-full">
          <ChartContainer config={config}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      stroke="var(--background)"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
            <ChartLegend content={<ChartLegendContent />} verticalAlign="bottom" />
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
