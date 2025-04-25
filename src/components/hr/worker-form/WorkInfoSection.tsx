
import { Department, ShiftType, WorkdayType } from "@/types";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./schema";
import { DepartmentSelect } from "./work-info/DepartmentSelect";
import { ShiftSelect } from "./work-info/ShiftSelect";
import { WorkdaySelect } from "./work-info/WorkdaySelect";

interface WorkInfoSectionProps {
  form: UseFormReturn<FormValues>;
  isSubmitting: boolean;
  departments: Department[];
  shifts: ShiftType[];
  workdayTypes: WorkdayType[];
}

export function WorkInfoSection({ form, isSubmitting, departments, shifts, workdayTypes }: WorkInfoSectionProps) {
  return (
    <div className="space-y-4">
      <DepartmentSelect 
        form={form} 
        departments={departments} 
        isSubmitting={isSubmitting} 
      />
      <ShiftSelect 
        form={form} 
        shifts={shifts} 
        isSubmitting={isSubmitting} 
      />
      <WorkdaySelect 
        form={form} 
        workdayTypes={workdayTypes} 
        isSubmitting={isSubmitting} 
      />
    </div>
  );
}
