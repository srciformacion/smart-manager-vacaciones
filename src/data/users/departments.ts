
export const DEPARTMENTS = [
  "Human Resources",
  "IT", 
  "Operations",
  "Marketing",
  "Sales",
  "Finance",
  "Emergency Services",
  "Call Center",
  "Medical Support",
  "Telecommunications"
] as const;

export const SHIFTS = [
  "Morning", 
  "Afternoon", 
  "Night",
  "Emergency 24h",
  "Emergency 12h",
  "Scheduled",
  "On-call",
  "Localizado",
  "Programado Mañana",
  "Programado Tarde",
  "Programado Noche",
  "Teleoperador Rotativo Mañana",
  "Teleoperador Rotativo Tarde",
  "Teleoperador Rotativo Noche",
  "Urgencias 24h",
  "Urgencias 12h"
] as const;

export const WORKDAYS = ["L-V", "L-S", "Rotativo", "24h Cycle", "Flexible"] as const;

export const ROLES = ["worker", "hr"] as const;

// Posiciones específicas para servicios de urgencias y teleoperación
export const POSITIONS = [
  // Servicios de Urgencias
  "Operador de Urgencias 24h",
  "Operador de Urgencias 12h",
  "Coordinador de Urgencias",
  "Técnico de Urgencias",
  "Dispatcher de Emergencias",
  "Técnico Localizado Urgencias",
  
  // Call Center / Teleoperadoras
  "Teleoperadora Programada",
  "Teleoperador de Urgencias", 
  "Teleoperadora Rotativa",
  "Supervisor de Call Center",
  "Agente de Atención al Cliente",
  
  // Trabajadores Programados
  "Operario Turno Mañana",
  "Operario Turno Tarde", 
  "Operario Turno Noche",
  "Especialista de Fin de Semana",
  
  // Personal de Apoyo
  "Técnico de Soporte IT",
  "Auxiliar Administrativo",
  "Supervisor de Calidad Sanitaria",
  "Coordinador de Formación",
  "Técnico Emergencias Médicas",
  "Especialista Comunicaciones",
  "Administrador de Sistemas",
  "Analista de Comunicaciones"
] as const;
