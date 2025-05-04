
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportForm } from "./report-form";
import { ReportHistory } from "./report-history";
import { ReportsGeneratorProps } from "./types";

export function ReportsGenerator({ users, departments }: ReportsGeneratorProps) {
  // Convert departments array to string array if needed
  const departmentNames = departments.map((dept) => 
    typeof dept === 'string' ? dept : dept.toString()
  );
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Generador de informes</CardTitle>
        <CardDescription>
          Genere informes personalizados para análisis y gestión
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="nuevo" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="nuevo">Nuevo informe</TabsTrigger>
            <TabsTrigger value="historial">Historial</TabsTrigger>
          </TabsList>
          
          <TabsContent value="nuevo" className="space-y-4">
            <ReportForm departments={departmentNames} />
          </TabsContent>
          
          <TabsContent value="historial" className="space-y-4">
            <ReportHistory />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
