
import React from 'react';
import { EmployeeDataGenerator } from '@/components/hr/data-generation/EmployeeDataGenerator';

export function DataGenerationPage() {
  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Generador de Datos de Empleados</h1>
        <p className="text-muted-foreground">
          Esta herramienta genera datos simulados de empleados del sector sanitario para el año 2025.
        </p>
      </div>
      
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
        
        <div className="text-sm text-muted-foreground mt-4">
          <p>
            <strong>Nota:</strong> La generación de datos puede tomar unos segundos dependiendo 
            de la cantidad solicitada. El archivo se descargará automáticamente.
          </p>
        </div>
      </div>
    </div>
  );
}

export default DataGenerationPage;
