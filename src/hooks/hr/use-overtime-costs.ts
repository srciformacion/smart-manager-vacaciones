
import { useMemo } from 'react';

// Configuración de tarifas por horas extras según tipo de trabajador y antigüedad
export interface OvertimeCostConfig {
  baseRate: number; // Tarifa base por hora extra
  seniorityMultiplier: number; // Multiplicador por antigüedad
  positionMultiplier: number; // Multiplicador por posición
}

export interface WorkerOvertimeData {
  userId: string;
  name: string;
  department: string;
  position: string;
  startDate: Date;
  overtimeHours: number;
  regularHours: number;
}

export interface OvertimeCostCalculation {
  userId: string;
  name: string;
  position: string;
  seniorityYears: number;
  overtimeHours: number;
  baseRate: number;
  seniorityMultiplier: number;
  positionMultiplier: number;
  totalCost: number;
  costPerHour: number;
}

export function useOvertimeCosts() {
  // Configuración de tarifas base
  const overtimeConfig = useMemo(() => ({
    baseRates: {
      default: 15, // €/hora base
      conductor: 20, // €/hora para conductores
      tecnico: 18, // €/hora para técnicos
      enfermeria: 16, // €/hora para enfermería
      medicina: 22, // €/hora para medicina
    },
    seniorityRates: {
      '0-2': 1.0,   // 0-2 años: tarifa base
      '3-5': 1.1,   // 3-5 años: +10%
      '6-10': 1.25, // 6-10 años: +25%
      '11-15': 1.4, // 11-15 años: +40%
      '16+': 1.6,   // 16+ años: +60%
    },
    positionMultipliers: {
      conductor: 1.3,
      tecnico: 1.2,
      enfermero: 1.1,
      medico: 1.5,
      default: 1.0
    }
  }), []);

  const calculateSeniorityYears = (startDate: Date): number => {
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
    return diffYears;
  };

  const getSeniorityMultiplier = (years: number): number => {
    if (years <= 2) return overtimeConfig.seniorityRates['0-2'];
    if (years <= 5) return overtimeConfig.seniorityRates['3-5'];
    if (years <= 10) return overtimeConfig.seniorityRates['6-10'];
    if (years <= 15) return overtimeConfig.seniorityRates['11-15'];
    return overtimeConfig.seniorityRates['16+'];
  };

  const getBaseRate = (department: string, position: string): number => {
    const normalizedPosition = position.toLowerCase();
    const normalizedDepartment = department.toLowerCase();

    if (normalizedPosition.includes('conductor')) {
      return overtimeConfig.baseRates.conductor;
    }
    if (normalizedPosition.includes('tecnico') || normalizedPosition.includes('técnico')) {
      return overtimeConfig.baseRates.tecnico;
    }
    if (normalizedDepartment.includes('enfermeria') || normalizedDepartment.includes('enfermería')) {
      return overtimeConfig.baseRates.enfermeria;
    }
    if (normalizedDepartment.includes('medicina') || normalizedPosition.includes('medico') || normalizedPosition.includes('médico')) {
      return overtimeConfig.baseRates.medicina;
    }

    return overtimeConfig.baseRates.default;
  };

  const getPositionMultiplier = (position: string): number => {
    const normalizedPosition = position.toLowerCase();
    
    if (normalizedPosition.includes('conductor')) {
      return overtimeConfig.positionMultipliers.conductor;
    }
    if (normalizedPosition.includes('tecnico') || normalizedPosition.includes('técnico')) {
      return overtimeConfig.positionMultipliers.tecnico;
    }
    if (normalizedPosition.includes('enfermero') || normalizedPosition.includes('enfermera')) {
      return overtimeConfig.positionMultipliers.enfermero;
    }
    if (normalizedPosition.includes('medico') || normalizedPosition.includes('médico')) {
      return overtimeConfig.positionMultipliers.medico;
    }

    return overtimeConfig.positionMultipliers.default;
  };

  const calculateOvertimeCosts = (workersData: WorkerOvertimeData[]): OvertimeCostCalculation[] => {
    return workersData.map(worker => {
      const seniorityYears = calculateSeniorityYears(worker.startDate);
      const baseRate = getBaseRate(worker.department, worker.position);
      const seniorityMultiplier = getSeniorityMultiplier(seniorityYears);
      const positionMultiplier = getPositionMultiplier(worker.position);
      
      const costPerHour = baseRate * seniorityMultiplier * positionMultiplier;
      const totalCost = worker.overtimeHours * costPerHour;

      return {
        userId: worker.userId,
        name: worker.name,
        position: worker.position,
        seniorityYears,
        overtimeHours: worker.overtimeHours,
        baseRate,
        seniorityMultiplier,
        positionMultiplier,
        totalCost,
        costPerHour
      };
    });
  };

  const getTotalOvertimeCosts = (calculations: OvertimeCostCalculation[]): number => {
    return calculations.reduce((total, calc) => total + calc.totalCost, 0);
  };

  const getOvertimeCostsByDepartment = (calculations: OvertimeCostCalculation[], workersData: WorkerOvertimeData[]) => {
    const costsByDepartment: Record<string, number> = {};
    
    calculations.forEach(calc => {
      const worker = workersData.find(w => w.userId === calc.userId);
      if (worker) {
        const dept = worker.department;
        costsByDepartment[dept] = (costsByDepartment[dept] || 0) + calc.totalCost;
      }
    });

    return costsByDepartment;
  };

  const getOvertimeCostsByPosition = (calculations: OvertimeCostCalculation[]) => {
    const costsByPosition: Record<string, { count: number; totalCost: number; averageCost: number }> = {};
    
    calculations.forEach(calc => {
      const position = calc.position;
      if (!costsByPosition[position]) {
        costsByPosition[position] = { count: 0, totalCost: 0, averageCost: 0 };
      }
      
      costsByPosition[position].count += 1;
      costsByPosition[position].totalCost += calc.totalCost;
      costsByPosition[position].averageCost = costsByPosition[position].totalCost / costsByPosition[position].count;
    });

    return costsByPosition;
  };

  return {
    calculateOvertimeCosts,
    getTotalOvertimeCosts,
    getOvertimeCostsByDepartment,
    getOvertimeCostsByPosition,
    calculateSeniorityYears,
    getSeniorityMultiplier,
    getBaseRate,
    getPositionMultiplier,
    overtimeConfig
  };
}
