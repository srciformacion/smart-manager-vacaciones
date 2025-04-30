
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfileAuth } from "@/hooks/profile/useProfileAuth";
import { toast } from "@/components/ui/use-toast";
import { exampleRequests } from "@/data/example-requests";
import { exampleWorkers } from "@/data/example-users";
import { exampleBalances } from "@/data/example-balances";
import { Request, User, Balance } from "@/types";
import { SmartAssistant } from "@/utils/hr/smart-assistant";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export function useSmartAssistant() {
  const { user, fetchAuthUser } = useProfileAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState<Request[]>(exampleRequests);
  const [workers, setWorkers] = useState<User[]>(exampleWorkers);
  const [balances, setBalances] = useState<Record<string, Balance>>(exampleBalances);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const authUser = await fetchAuthUser();
      if (!authUser) {
        navigate('/auth');
        return;
      }
      
      const role = authUser.user_metadata?.role || localStorage.getItem('userRole');
      if (role !== 'hr') {
        navigate('/dashboard');
        return;
      }
      
      // Simulate data refresh
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // En un entorno real, aquí se cargarían los datos actuales
      // Por ahora, simplemente actualizamos el estado con los mismos datos de ejemplo
      setRequests([...exampleRequests]);
      
      toast({
        title: "Datos actualizados",
        description: "Los datos del asistente inteligente han sido actualizados"
      });
      
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron actualizar los datos"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = async (format: 'pdf' | 'excel') => {
    try {
      // Obtener los datos de análisis
      const analysis = SmartAssistant.analyze(requests, workers, Object.values(balances));
      
      if (format === 'excel') {
        await exportToExcel(analysis);
      } else if (format === 'pdf') {
        await exportToPdf(analysis);
      }
      
      toast({
        title: `Exportación completada`,
        description: `Los datos han sido exportados en formato ${format.toUpperCase()} correctamente.`
      });
      
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudieron exportar los datos en formato ${format.toUpperCase()}`
      });
    }
  };
  
  const exportToExcel = async (analysis: ReturnType<typeof SmartAssistant.analyze>) => {
    const workbook = XLSX.utils.book_new();
    
    // Hoja de solapamientos
    if (analysis.overlaps.length > 0) {
      const overlapsData = analysis.overlaps.map(item => ({
        'ID Solicitud': item.requestId,
        'Trabajador': item.userName,
        'Departamento': item.department,
        'Tipo de Solapamiento': item.overlapType,
        'Fecha Inicio': formatDate(item.startDate),
        'Fecha Fin': formatDate(item.endDate),
        'Descripción': item.description
      }));
      
      const overlapsSheet = XLSX.utils.json_to_sheet(overlapsData);
      XLSX.utils.book_append_sheet(workbook, overlapsSheet, "Solapamientos");
    }
    
    // Hoja de concentración de grupos
    if (analysis.groupCrowding.length > 0) {
      const crowdingData = analysis.groupCrowding.map(item => ({
        'Departamento': item.department,
        'Fecha': formatDate(item.date),
        'Ausencias': item.absenceCount,
        'Total Trabajadores': item.totalWorkers,
        'Porcentaje': `${item.absencePercentage.toFixed(2)}%`,
        'Nivel de Riesgo': item.riskLevel
      }));
      
      const crowdingSheet = XLSX.utils.json_to_sheet(crowdingData);
      XLSX.utils.book_append_sheet(workbook, crowdingSheet, "Concentración");
    }
    
    // Hoja de acumulación de permisos
    if (analysis.permissionAccumulation.length > 0) {
      const permissionData = analysis.permissionAccumulation.map(item => ({
        'Trabajador': item.userName,
        'Departamento': item.department,
        'Permisos Pendientes': item.pendingCount,
        'Días Acumulados': item.totalDays,
        'Último Permiso': formatDate(item.lastPermissionDate)
      }));
      
      const permissionSheet = XLSX.utils.json_to_sheet(permissionData);
      XLSX.utils.book_append_sheet(workbook, permissionSheet, "Acumulación Permisos");
    }
    
    // Hoja de límite de vacaciones
    if (analysis.vacationLimit.length > 0) {
      const vacationData = analysis.vacationLimit.map(item => ({
        'Trabajador': item.userName,
        'Vacaciones Pendientes': item.pendingDays,
        'Fecha Límite': formatDate(item.expiryDate),
        'Días Hasta Expiración': item.daysUntilExpiry
      }));
      
      const vacationSheet = XLSX.utils.json_to_sheet(vacationData);
      XLSX.utils.book_append_sheet(workbook, vacationSheet, "Límite Vacaciones");
    }
    
    // Exportar el archivo
    XLSX.writeFile(workbook, "analisis_asistente_inteligente.xlsx");
  };
  
  const exportToPdf = async (analysis: ReturnType<typeof SmartAssistant.analyze>) => {
    const doc = new jsPDF();
    
    // Título del documento
    doc.setFontSize(18);
    doc.text("Informe del Asistente Inteligente", 14, 22);
    doc.setFontSize(11);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30);
    
    let yPos = 40;
    
    // Sección de solapamientos
    if (analysis.overlaps.length > 0) {
      doc.setFontSize(14);
      doc.text("Alertas de Solapamientos", 14, yPos);
      yPos += 10;
      
      const overlapsData = analysis.overlaps.map(item => [
        item.userName,
        item.department,
        item.overlapType,
        formatDate(item.startDate),
        formatDate(item.endDate)
      ]);
      
      doc.autoTable({
        startY: yPos,
        head: [['Trabajador', 'Departamento', 'Tipo', 'Inicio', 'Fin']],
        body: overlapsData,
        margin: { top: 10 }
      });
      
      yPos = (doc as any).lastAutoTable.finalY + 15;
    }
    
    // Sección de concentración de grupos
    if (analysis.groupCrowding.length > 0) {
      // Añadir nueva página si no hay espacio suficiente
      if (yPos > 200) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(14);
      doc.text("Alertas de Concentración de Grupos", 14, yPos);
      yPos += 10;
      
      const crowdingData = analysis.groupCrowding.map(item => [
        item.department,
        formatDate(item.date),
        item.absenceCount.toString(),
        `${item.absencePercentage.toFixed(2)}%`,
        item.riskLevel
      ]);
      
      doc.autoTable({
        startY: yPos,
        head: [['Departamento', 'Fecha', 'Ausencias', 'Porcentaje', 'Riesgo']],
        body: crowdingData,
        margin: { top: 10 }
      });
      
      yPos = (doc as any).lastAutoTable.finalY + 15;
    }
    
    // Sección de acumulación de permisos
    if (analysis.permissionAccumulation.length > 0) {
      // Añadir nueva página si no hay espacio suficiente
      if (yPos > 200) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(14);
      doc.text("Alertas de Acumulación de Permisos", 14, yPos);
      yPos += 10;
      
      const permissionData = analysis.permissionAccumulation.map(item => [
        item.userName,
        item.department,
        item.pendingCount.toString(),
        item.totalDays.toString(),
        formatDate(item.lastPermissionDate)
      ]);
      
      doc.autoTable({
        startY: yPos,
        head: [['Trabajador', 'Departamento', 'Pendientes', 'Días Acum.', 'Último Permiso']],
        body: permissionData,
        margin: { top: 10 }
      });
      
      yPos = (doc as any).lastAutoTable.finalY + 15;
    }
    
    // Sección de límite de vacaciones
    if (analysis.vacationLimit.length > 0) {
      // Añadir nueva página si no hay espacio suficiente
      if (yPos > 200) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(14);
      doc.text("Alertas de Límite de Vacaciones", 14, yPos);
      yPos += 10;
      
      const vacationData = analysis.vacationLimit.map(item => [
        item.userName,
        item.pendingDays.toString(),
        formatDate(item.expiryDate),
        item.daysUntilExpiry.toString()
      ]);
      
      doc.autoTable({
        startY: yPos,
        head: [['Trabajador', 'Días Pendientes', 'Fecha Límite', 'Días Restantes']],
        body: vacationData,
        margin: { top: 10 }
      });
    }
    
    // Guardar el PDF
    doc.save("informe_asistente_inteligente.pdf");
  };
  
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return {
    user,
    isLoading,
    requests,
    workers,
    balances,
    handleRefresh,
    exportData
  };
}
