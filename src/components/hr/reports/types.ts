
import { User, Request, Department } from "@/types";

// Define the types for report types and formats
export type ReportType = 'turnos' | 'vacaciones' | 'permisos' | 'cambios';
export type ReportFormat = 'pdf' | 'excel' | 'csv';

export interface ReportParams {
  startDate: string;
  endDate: string;
  reportType: ReportType;
  reportFormat: ReportFormat;
  department: string | null;
}

export interface ReportsGeneratorProps {
  users: User[];
  departments: Department[];
  requests: Request[];
}

export interface HistoricalReport {
  id: string;
  date: Date;
  type: ReportType;
  format: ReportFormat;
  status: 'pending' | 'completed' | 'failed';
}
