
import React, { useState } from 'react';
import { EmployeeDataGenerator } from '@/components/hr/data-generation/EmployeeDataGenerator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MainLayout } from '@/components/layout/main-layout';
import { useProfileAuth } from '@/hooks/profile/useProfileAuth';
import { generateEmployeeData } from '@/utils/data-generation/employee-data-generator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { FileJson, Upload, Database } from 'lucide-react';

export function DataGenerationPage() {
  const { user } = useProfileAuth();
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewCount, setPreviewCount] = useState(10); // Default to 10 records in preview

  const generatePreviewData = () => {
    // Generate preview records
    const sampleData = generateEmployeeData(previewCount);
    setPreviewData(sampleData);
    setShowPreview(true);
  };

  return (
    <MainLayout user={user}>
      <div className="container py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Generador de Datos de Empleados</h1>
          <p className="text-muted-foreground">
            Esta herramienta genera datos simulados de empleados del sector sanitario para el año 2025.
          </p>
        </div>
        
        <Tabs defaultValue="generator">
          <TabsList className="mb-6">
            <TabsTrigger value="generator">Generador</TabsTrigger>
            <TabsTrigger value="import">Importación</TabsTrigger>
            <TabsTrigger value="preview">Vista previa</TabsTrigger>
          </TabsList>
          
          <TabsContent value="generator">
            <div className="grid gap-6">
              <div className="p-4 border rounded-lg bg-card">
                <h2 className="text-lg font-semibold mb-2">Información incluida</h2>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Datos personales (nombre, DNI, email, teléfono)</li>
                  <li>Información laboral (fecha de entrada, tipo de jornada, grupo)</li>
                  <li>Calendario anual completo con asignación de turnos</li>
                  <li>Planificación de vacaciones simuladas</li>
                  <li>Cómputo de horas anuales y ajustes</li>
                </ul>
              </div>
              
              <EmployeeDataGenerator />
              
              <div className="flex flex-col md:flex-row justify-center gap-4 mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setPreviewCount(10);
                    generatePreviewData();
                  }}
                  className="flex items-center gap-2"
                >
                  <FileJson className="h-4 w-4" />
                  Ver 10 perfiles
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setPreviewCount(50);
                    generatePreviewData();
                  }}
                  className="flex items-center gap-2"
                >
                  <FileJson className="h-4 w-4" />
                  Ver 50 perfiles
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setPreviewCount(300);
                    generatePreviewData();
                  }}
                  className="flex items-center gap-2"
                >
                  <FileJson className="h-4 w-4" />
                  Ver todos (300 perfiles)
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground mt-4">
                <p>
                  <strong>Nota:</strong> La generación de datos puede tomar unos segundos dependiendo 
                  de la cantidad solicitada. El archivo se descargará automáticamente.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="import">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Instrucciones de importación</h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Importar a Supabase
                  </h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Accede al panel de Supabase del proyecto</li>
                    <li>Navega a la sección "Table Editor"</li>
                    <li>Selecciona la tabla donde deseas importar los datos</li>
                    <li>Haz clic en "Import" en la parte superior</li>
                    <li>Selecciona el archivo JSON o CSV generado</li>
                    <li>Mapea las columnas según corresponda</li>
                    <li>Haz clic en "Import" para completar el proceso</li>
                  </ol>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Importar a otro sistema
                  </h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>El archivo CSV puede importarse directamente en Excel o Google Sheets</li>
                    <li>Para bases de datos SQL, utiliza las herramientas de importación propias del sistema</li>
                    <li>El formato JSON es compatible con la mayoría de sistemas NoSQL</li>
                    <li>Los datos incluyen todas las relaciones necesarias entre las entidades</li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="preview">
            {showPreview ? (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Muestra de datos generados ({previewData.length} registros)</h2>
                <p className="text-sm text-muted-foreground">
                  A continuación se muestra una muestra de {previewData.length} registros para que puedas ver el formato de los datos generados.
                </p>
                
                <ScrollArea className="h-[500px] border rounded-lg p-4 bg-muted/30">
                  <pre className="text-xs whitespace-pre-wrap">
                    {JSON.stringify(previewData, null, 2)}
                  </pre>
                </ScrollArea>
                
                <div className="text-sm">
                  <p className="font-medium">Estructura de datos:</p>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li><strong>nombre_completo, dni, email, telefono:</strong> Datos personales del empleado</li>
                    <li><strong>fecha_entrada, tipo_jornada, grupo:</strong> Información laboral</li>
                    <li><strong>turno_base:</strong> Tipo de turno asignado (M, N, etc.)</li>
                    <li><strong>calendario:</strong> Array con 365 objetos, uno para cada día del año 2025</li>
                    <li><strong>vacaciones:</strong> Array con las 32 fechas de vacaciones asignadas</li>
                    <li><strong>horas_anuales, horas_antiguedad, ajuste_horas:</strong> Información de cómputo horario</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p>Haz clic en uno de los botones de vista previa en la pestaña Generador para visualizar los datos.</p>
                <div className="flex justify-center gap-4 mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setPreviewCount(10);
                      generatePreviewData();
                    }}
                  >
                    Ver 10 perfiles
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setPreviewCount(50);
                      generatePreviewData();
                    }}
                  >
                    Ver 50 perfiles
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setPreviewCount(300);
                      generatePreviewData();
                    }}
                  >
                    Ver todos (300 perfiles)
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

export default DataGenerationPage;
