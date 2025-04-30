
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { SmartAssistantAnalysis } from "@/utils/hr/smart-assistant/types";

// Declaración del módulo para la funcionalidad de autoTable en jsPDF
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

/**
 * Formatea una fecha para mostrarla en formato local
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Exporta los datos de análisis a un archivo Excel
 */
export const exportToExcel = async (analysis: SmartAssistantAnalysis) => {
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

/**
 * Exporta los datos de análisis a un archivo PDF
 */
export const exportToPdf = async (analysis: SmartAssistantAnalysis) => {
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
