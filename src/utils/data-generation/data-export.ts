
import { generateEmployeeData, exportAsJson, exportAsCsv } from './employee-data-generator';

// Function to download data as a file
export function downloadDataAsFile(data: string, fileName: string, fileType: string): void {
  const blob = new Blob([data], { type: fileType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Generate and download employee data as JSON
export function generateAndDownloadEmployeeJson(count: number = 300): void {
  const employees = generateEmployeeData(count);
  const jsonData = exportAsJson(employees);
  downloadDataAsFile(jsonData, 'empleados-sanitarios-2025.json', 'application/json');
}

// Generate and download employee data as CSV
export function generateAndDownloadEmployeeCsv(count: number = 300): void {
  const employees = generateEmployeeData(count);
  const csvData = exportAsCsv(employees);
  downloadDataAsFile(csvData, 'empleados-sanitarios-2025.csv', 'text/csv');
}
