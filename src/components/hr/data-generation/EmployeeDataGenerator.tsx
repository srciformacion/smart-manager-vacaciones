
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generateAndDownloadEmployeeJson, generateAndDownloadEmployeeCsv } from '@/utils/data-generation/data-export';
import { Loader2, FileDown, FileJson, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export function EmployeeDataGenerator() {
  const [count, setCount] = useState<number>(300);
  const [fileType, setFileType] = useState<'json' | 'csv'>('json');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      // Use setTimeout to allow UI to update before CPU-intensive operation
      setTimeout(() => {
        if (fileType === 'json') {
          generateAndDownloadEmployeeJson(count);
        } else {
          generateAndDownloadEmployeeCsv(count);
        }
        
        toast.success(`${count} perfiles de empleados generados con éxito`, {
          description: `Archivo ${fileType.toUpperCase()} descargado correctamente.`
        });
        setIsGenerating(false);
      }, 100);
    } catch (error) {
      console.error('Error generating employee data:', error);
      toast.error('Error al generar los datos de empleados');
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Generador de Datos de Empleados</CardTitle>
        <CardDescription>
          Generar perfiles simulados de empleados sanitarios para el año 2025
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="count">Número de empleados</Label>
            <Input
              id="count"
              type="number"
              min="1"
              max="1000"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 300)}
            />
            <p className="text-xs text-muted-foreground">
              Recomendado: 300 perfiles (máximo 1000)
            </p>
          </div>
          
          <div className="space-y-2">
            <Label>Formato de archivo</Label>
            <RadioGroup
              value={fileType}
              onValueChange={(value) => setFileType(value as 'json' | 'csv')}
              className="flex flex-col space-y-3"
            >
              <div className="flex items-center space-x-3 rounded-md border p-3">
                <RadioGroupItem value="json" id="json" />
                <Label htmlFor="json" className="flex items-center gap-2 cursor-pointer">
                  <FileJson className="h-4 w-4" />
                  <div>
                    <span className="font-medium">JSON</span>
                    <p className="text-xs text-muted-foreground">Recomendado para importaciones a bases de datos NoSQL</p>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-3 rounded-md border p-3">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="flex items-center gap-2 cursor-pointer">
                  <FileText className="h-4 w-4" />
                  <div>
                    <span className="font-medium">CSV</span>
                    <p className="text-xs text-muted-foreground">Mejor para hojas de cálculo y sistemas SQL</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleGenerate}
          disabled={isGenerating || count < 1}
          className="w-full gap-2"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generando...
            </>
          ) : (
            <>
              <FileDown className="h-4 w-4" />
              Generar y Descargar
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
