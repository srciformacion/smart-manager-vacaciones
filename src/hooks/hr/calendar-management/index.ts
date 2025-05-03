
import { useState } from "react";
import { useCalendarState } from "./use-calendar-state";
import { useCalendarActions } from "./use-calendar-actions";
import { useCalendarTemplates } from "./use-calendar-templates";
import { useCalendarReports } from "./use-calendar-reports";
import { useCalendarExport } from "./use-calendar-export";
import { CalendarState } from "./types";

export function useCalendarManagement() {
  const [state, setState] = useState<CalendarState>({
    selectedUser: null,
    currentDate: new Date(),
    shifts: [],
    annualHours: null,
    isEditing: false,
    selectedShift: null,
  });

  const actions = useCalendarActions(state, setState);
  const templateActions = useCalendarTemplates();
  const reportActions = useCalendarReports(state.annualHours);
  const exportActions = useCalendarExport();

  return {
    // State
    selectedUser: state.selectedUser,
    currentDate: state.currentDate,
    shifts: state.shifts,
    annualHours: state.annualHours,
    isEditing: state.isEditing,
    selectedShift: state.selectedShift,
    
    // Actions
    ...actions,
    ...templateActions,
    ...reportActions,
    ...exportActions
  };
}

export * from './types';
