import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { BasicInfoSection } from "./form-sections/basic-info-section";
import { ReportTypeSection } from "./form-sections/report-type-section";
import { DateRangeSection } from "./form-sections/date-range-section";
import { DepartmentSelection } from "./form-sections/department-selection";
import { EmployeeSelection } from "./form-sections/employee-selection";
import { StatusFilterSection } from "./form-sections/status-filter-section";
import { ShiftFilterSection } from "./form-sections/shift-filter-section";
import { AdditionalOptions } from "./form-sections/additional-options";
import { SchedulingSection } from "./form-sections/scheduling-section";
import { ComparisonSection } from "./form-sections/comparison-section";
import { AlertsSection } from "./form-sections/alerts-section";
import { OvertimeCostsFormSection } from "./form-sections/overtime-costs-section";

interface AdvancedReportFormProps {
  onSubmit: (reportConfig: any) => void;
}

export function AdvancedReportForm({ onSubmit }: AdvancedReportFormProps) {
  const [reportType, setReportType] = useState("vacations");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(new Date());
  const [dateTo, setDateTo] = useState<Date | undefined>(new Date());
  const [reportName, setReportName] = useState("");
  const [format, setFormat] = useState("excel");
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [allEmployees, setAllEmployees] = useState(true);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedShifts, setSelectedShifts] = useState<string[]>([]);
  const [includeGraphics, setIncludeGraphics] = useState(true);
  const [includeSummary, setIncludeSummary] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // Nuevas variables de estado para funcionalidades avanzadas
  const [enableScheduling, setEnableScheduling] = useState(false);
  const [scheduleFrequency, setScheduleFrequency] = useState("weekly");
  const [scheduleTime, setScheduleTime] = useState("09:00");
  const [scheduleDayOfWeek, setScheduleDayOfWeek] = useState("monday");
  const [scheduleDayOfMonth, setScheduleDayOfMonth] = useState("1");
  const [enableEmailSending, setEnableEmailSending] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState("");
  
  const [enableComparison, setEnableComparison] = useState(false);
  const [comparisonType, setComparisonType] = useState("previous_period");
  const [comparisonPeriodStart, setComparisonPeriodStart] = useState<Date | undefined>();
  const [comparisonPeriodEnd, setComparisonPeriodEnd] = useState<Date | undefined>();
  
  const [enableAlerts, setEnableAlerts] = useState(false);
  const [alertTypes, setAlertTypes] = useState<string[]>([]);
  const [alertThresholds, setAlertThresholds] = useState<Record<string, string>>({});
  const [alertRecipients, setAlertRecipients] = useState("");

  // Nuevas variables para costos de horas extras
  const [includeOvertimeCosts, setIncludeOvertimeCosts] = useState(false);
  const [includePositionAnalysis, setIncludePositionAnalysis] = useState(true);
  const [includeSeniorityAnalysis, setIncludeSeniorityAnalysis] = useState(true);
  const [includeDetailedBreakdown, setIncludeDetailedBreakdown] = useState(false);

  const departmentOptions = [
    "Enfermería", "Medicina", "Administración", "Limpieza", 
    "Seguridad", "Cocina", "Mantenimiento", "Dirección"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor, introduce un nombre para el informe"
      });
      return;
    }

    setIsGenerating(true);

    const reportConfig = {
      name: reportName,
      type: reportType,
      format,
      dateRange: { from: dateFrom, to: dateTo },
      departments: departments.length > 0 ? departments : departmentOptions,
      employees: allEmployees ? "all" : selectedEmployees,
      statuses: selectedStatuses.length > 0 ? selectedStatuses : ["pending", "approved", "rejected", "in_review"],
      shifts: selectedShifts.length > 0 ? selectedShifts : ["morning", "afternoon", "night", "emergency", "oncall", "flexible"],
      includeGraphics,
      includeSummary,
      // Nuevas configuraciones avanzadas
      scheduling: enableScheduling ? {
        frequency: scheduleFrequency,
        time: scheduleTime,
        dayOfWeek: scheduleDayOfWeek,
        dayOfMonth: scheduleDayOfMonth,
        emailSending: enableEmailSending,
        emailRecipients: emailRecipients
      } : null,
      comparison: enableComparison ? {
        type: comparisonType,
        customPeriod: comparisonType === "custom_period" ? {
          start: comparisonPeriodStart,
          end: comparisonPeriodEnd
        } : null
      } : null,
      alerts: enableAlerts ? {
        types: alertTypes,
        thresholds: alertThresholds,
        recipients: alertRecipients
      } : null,
      // Nueva configuración de costos de horas extras
      overtimeCosts: includeOvertimeCosts ? {
        includePositionAnalysis,
        includeSeniorityAnalysis,
        includeDetailedBreakdown
      } : null,
      generatedAt: new Date()
    };

    // Simular generación
    setTimeout(() => {
      setIsGenerating(false);
      onSubmit(reportConfig);
      
      // Limpiar formulario
      setReportName("");
      setDepartments([]);
      setSelectedEmployees([]);
      setSelectedStatuses([]);
      setSelectedShifts([]);
      setEnableScheduling(false);
      setEnableComparison(false);
      setEnableAlerts(false);
      setEmailRecipients("");
      setAlertRecipients("");
      setIncludeOvertimeCosts(false);
      
      toast({
        title: "Informe generado",
        description: `El informe "${reportName}" ha sido generado exitosamente${enableScheduling ? ' y programado' : ''}`,
      });
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Configuración Avanzada de Informes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <BasicInfoSection
            reportName={reportName}
            setReportName={setReportName}
            format={format}
            setFormat={setFormat}
          />

          <ReportTypeSection
            reportType={reportType}
            setReportType={setReportType}
          />

          <DateRangeSection
            dateFrom={dateFrom}
            setDateFrom={setDateFrom}
            dateTo={dateTo}
            setDateTo={setDateTo}
          />

          <Separator />

          <DepartmentSelection
            departments={departments}
            setDepartments={setDepartments}
          />

          <Separator />

          <EmployeeSelection
            selectedEmployees={selectedEmployees}
            setSelectedEmployees={setSelectedEmployees}
            allEmployees={allEmployees}
            setAllEmployees={setAllEmployees}
          />

          <Separator />

          <StatusFilterSection
            selectedStatuses={selectedStatuses}
            setSelectedStatuses={setSelectedStatuses}
          />

          <Separator />

          <ShiftFilterSection
            selectedShifts={selectedShifts}
            setSelectedShifts={setSelectedShifts}
          />

          <Separator />

          <AdditionalOptions
            includeGraphics={includeGraphics}
            setIncludeGraphics={setIncludeGraphics}
            includeSummary={includeSummary}
            setIncludeSummary={setIncludeSummary}
          />

          <Separator />

          <OvertimeCostsFormSection
            includeOvertimeCosts={includeOvertimeCosts}
            setIncludeOvertimeCosts={setIncludeOvertimeCosts}
            includePositionAnalysis={includePositionAnalysis}
            setIncludePositionAnalysis={setIncludePositionAnalysis}
            includeSeniorityAnalysis={includeSeniorityAnalysis}
            setIncludeSeniorityAnalysis={setIncludeSeniorityAnalysis}
            includeDetailedBreakdown={includeDetailedBreakdown}
            setIncludeDetailedBreakdown={setIncludeDetailedBreakdown}
          />

          <Separator />

          <SchedulingSection
            enableScheduling={enableScheduling}
            setEnableScheduling={setEnableScheduling}
            scheduleFrequency={scheduleFrequency}
            setScheduleFrequency={setScheduleFrequency}
            scheduleTime={scheduleTime}
            setScheduleTime={setScheduleTime}
            scheduleDayOfWeek={scheduleDayOfWeek}
            setScheduleDayOfWeek={setScheduleDayOfWeek}
            scheduleDayOfMonth={scheduleDayOfMonth}
            setScheduleDayOfMonth={setScheduleDayOfMonth}
            enableEmailSending={enableEmailSending}
            setEnableEmailSending={setEnableEmailSending}
            emailRecipients={emailRecipients}
            setEmailRecipients={setEmailRecipients}
          />

          <Separator />

          <ComparisonSection
            enableComparison={enableComparison}
            setEnableComparison={setEnableComparison}
            comparisonType={comparisonType}
            setComparisonType={setComparisonType}
            comparisonPeriodStart={comparisonPeriodStart}
            setComparisonPeriodStart={setComparisonPeriodStart}
            comparisonPeriodEnd={comparisonPeriodEnd}
            setComparisonPeriodEnd={setComparisonPeriodEnd}
          />

          <Separator />

          <AlertsSection
            enableAlerts={enableAlerts}
            setEnableAlerts={setEnableAlerts}
            alertTypes={alertTypes}
            setAlertTypes={setAlertTypes}
            alertThresholds={alertThresholds}
            setAlertThresholds={setAlertThresholds}
            alertRecipients={alertRecipients}
            setAlertRecipients={setAlertRecipients}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isGenerating || !reportName.trim()}
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Generando informe...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Generar informe
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
