
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
  "Scheduled",
  "On-call"
] as const;

export const WORKDAYS = ["L-V", "L-S", "Rotativo", "24h Cycle", "Flexible"] as const;

export const ROLES = ["worker", "hr"] as const;

// Specific positions for emergency and teleoperator services
export const POSITIONS = [
  // Emergency Services
  "Emergency Operator 24h",
  "Emergency Coordinator",
  "Emergency Technician",
  "Emergency Dispatcher",
  
  // Call Center / Teleoperators
  "Scheduled Teleoperator",
  "Emergency Teleoperator", 
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
