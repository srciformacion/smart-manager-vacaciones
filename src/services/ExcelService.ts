
import * as XLSX from 'xlsx';
import { CalendarShift, ShiftType } from '@/types/calendar';
import { User } from '@/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service to handle Excel import and export operations for calendars
 */
export class ExcelService {
  /**
   * Reads an Excel file and returns the parsed data
   * @param file Excel file to read
   * @returns Promise with parsed calendar shifts
   */
  static async importFromExcel(file: File): Promise<CalendarShift[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          if (!e.target?.result) {
            reject(new Error('Error reading file'));
            return;
          }
          
          const data = new Uint8Array(e.target.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get first sheet
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convert to JSON
          const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          // Parse data to calendar shifts
          const shifts: CalendarShift[] = [];
          const headers = jsonData[0] || [];
          
          // Find column indices
          const userIdIndex = headers.findIndex((h: string) => 
            h?.toLowerCase().includes('id') || h?.toLowerCase().includes('trabajador'));
          const dateIndex = headers.findIndex((h: string) => 
            h?.toLowerCase().includes('fecha') || h?.toLowerCase().includes('día'));
          const typeIndex = headers.findIndex((h: string) => 
            h?.toLowerCase().includes('turno') || h?.toLowerCase().includes('tipo'));
          const startTimeIndex = headers.findIndex((h: string) => 
            h?.toLowerCase().includes('inicio') || h?.toLowerCase().includes('entrada'));
          const endTimeIndex = headers.findIndex((h: string) => 
            h?.toLowerCase().includes('fin') || h?.toLowerCase().includes('salida'));
          const hoursIndex = headers.findIndex((h: string) => 
            h?.toLowerCase().includes('horas'));
          const notesIndex = headers.findIndex((h: string) => 
            h?.toLowerCase().includes('notas'));
          
          // Process data rows
          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            if (!row || row.length === 0) continue;
            
            const userId = userIdIndex >= 0 ? String(row[userIdIndex]) : '';
            const dateValue = dateIndex >= 0 ? row[dateIndex] : '';
            let date: Date;
            
            // Parse date
            if (dateValue instanceof Date) {
              date = dateValue;
            } else if (typeof dateValue === 'number' && dateValue > 10000) {
              // Excel date number
              date = XLSX.SSF.parse_date_code(dateValue);
            } else {
              // Try to parse string date
              date = new Date(dateValue);
              if (isNaN(date.getTime())) {
                console.warn(`Invalid date at row ${i+1}: ${dateValue}`);
                continue;
              }
            }
            
            // Get shift type
            let typeValue = typeIndex >= 0 ? String(row[typeIndex]).toLowerCase().trim() : '';
            let type: ShiftType = 'unassigned';
            
            // Map string values to ShiftType
            if (typeValue.includes('mañana')) type = 'morning';
            else if (typeValue.includes('tarde')) type = 'afternoon';
            else if (typeValue.includes('noche')) type = 'night';
            else if (typeValue.includes('24h')) type = '24h';
            else if (typeValue.includes('libre')) type = 'free';
            else if (typeValue.includes('guardia')) type = 'guard';
            else if (typeValue.includes('formación') || typeValue.includes('formacion')) type = 'training';
            else if (typeValue.includes('especial')) type = 'special';
            else if (typeValue.includes('localizado') || typeValue.includes('oncall')) type = 'oncall';
            else if (typeValue.includes('personal')) type = 'custom';
            
            // Get color based on type
            const color = this.getShiftColor(type);
            
            // Create shift object
            const shift: CalendarShift = {
              id: uuidv4(),
              userId,
              date,
              type,
              color,
              hours: hoursIndex >= 0 ? Number(row[hoursIndex]) || 0 : 0
            };
            
            // Add optional fields if present
            if (startTimeIndex >= 0 && row[startTimeIndex]) {
              shift.startTime = String(row[startTimeIndex]);
            }
            
            if (endTimeIndex >= 0 && row[endTimeIndex]) {
              shift.endTime = String(row[endTimeIndex]);
            }
            
            if (notesIndex >= 0 && row[notesIndex]) {
              shift.notes = String(row[notesIndex]);
            }
            
            shifts.push(shift);
          }
          
          resolve(shifts);
        } catch (error) {
          console.error('Error parsing Excel file:', error);
          reject(error);
        }
      };
      
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        reject(error);
      };
      
      reader.readAsArrayBuffer(file);
    });
  }
  
  /**
   * Exports calendar data to an Excel file
   * @param shifts Calendar shifts to export
   * @param users Users information for mapping IDs to names
   * @param sheetName Name of the Excel sheet
   * @returns Blob with the Excel file
   */
  static exportToExcel(shifts: CalendarShift[], users: User[], sheetName = 'Calendario'): Blob {
    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    
    // Map user IDs to names for the export
    const userIdToName: Record<string, string> = {};
    users.forEach(user => {
      userIdToName[user.id] = user.name;
    });
    
    // Prepare data for export
    const exportData = shifts.map(shift => {
      const userName = userIdToName[shift.userId] || shift.userId;
      const shiftType = this.getShiftTypeName(shift.type);
      
      return {
        'Trabajador': userName,
        'ID Trabajador': shift.userId,
        'Fecha': shift.date,
        'Turno': shiftType,
        'Hora Inicio': shift.startTime || '',
        'Hora Fin': shift.endTime || '',
        'Horas': shift.hours,
        'Notas': shift.notes || ''
      };
    });
    
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    // Set column widths
    const colWidths = [
      { wch: 25 }, // Trabajador
      { wch: 12 }, // ID Trabajador
      { wch: 12 }, // Fecha
      { wch: 12 }, // Turno
      { wch: 10 }, // Hora Inicio
      { wch: 10 }, // Hora Fin
      { wch: 8 },  // Horas
      { wch: 30 }  // Notas
    ];
    worksheet['!cols'] = colWidths;
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
    // Create Blob
    return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }
  
  /**
   * Maps a ShiftType to its display name
   */
  private static getShiftTypeName(type: ShiftType): string {
    switch (type) {
      case 'morning': return 'Mañana';
      case 'afternoon': return 'Tarde';
      case 'night': return 'Noche';
      case '24h': return '24h';
      case 'free': return 'Libre';
      case 'guard': return 'Guardia';
      case 'unassigned': return 'Sin asignar';
      case 'training': return 'Formación';
      case 'special': return 'Especial';
      case 'oncall': return 'Localizado';
      case 'custom': return 'Personalizado';
      default: return type;
    }
  }
  
  /**
   * Gets the color associated with a shift type
   */
  private static getShiftColor(type: ShiftType): any {
    switch (type) {
      case 'morning': return 'blue';
      case 'afternoon': return 'amber';
      case 'night': return 'indigo';
      case '24h': return 'red';
      case 'free': return 'green';
      case 'guard': return 'purple';
      case 'unassigned': return 'gray';
      case 'training': return 'orange';
      case 'special': return 'yellow';
      case 'oncall': return 'teal';
      case 'custom': return 'pink';
      default: return 'gray';
    }
  }
}
