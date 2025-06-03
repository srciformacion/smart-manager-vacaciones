
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

// Specific positions for emergency and teleoperator services
export const POSITIONS = [
  // Emergency Services
  "Emergency Operator 24h",
  "Emergency Operator 12h",
  "Emergency Coordinator",
  "Emergency Technician",
  "Emergency Dispatcher",
  "Localizado Emergency",
  
  // Call Center / Teleoperators
  "Scheduled Teleoperator",
  "Emergency Teleoperator", 
  "Teleoperador Rotativo",
  "Call Center Supervisor",
  "Customer Service Agent",
  
  // Scheduled Workers
  "Morning Shift Worker",
  "Afternoon Shift Worker", 
  "Night Shift Worker",
  "Weekend Specialist",
  
  // Support Staff
  "Technical Support",
  "Administrative Assistant",
  "Quality Supervisor",
  "Training Coordinator"
] as const;
