
import { User } from "@/types";
import { DEPARTMENTS, SHIFTS, WORKDAYS, ROLES, POSITIONS } from "./departments";

const FIRST_NAMES = [
  "Ana", "Carlos", "María", "José", "Laura", "Miguel", "Carmen", "Antonio", 
  "Isabel", "Francisco", "Pilar", "Manuel", "Rosa", "Juan", "Mercedes",
  "Rafael", "Concepción", "David", "Dolores", "Javier", "Josefa", "Daniel",
  "Teresa", "Alejandro", "Antonia", "Pedro", "Francisca", "Adrián", "Cristina",
  "Óscar", "Lucía", "Rubén", "Julia", "Álvaro", "Montserrat", "Sergio", "Esperanza",
  "Pablo", "Amparo", "Jorge", "Inmaculada", "Alberto", "Susana", "Roberto",
  "Elena", "Ignacio", "Beatriz", "Marco", "Yolanda", "Víctor", "Margarita",
  "Fernando", "Silvia", "Raúl", "Patricia", "Eduardo", "Rocío", "Gonzalo", "Nuria"
];

const LAST_NAMES = [
  "García", "Rodríguez", "González", "Fernández", "López", "Martínez", "Sánchez",
  "Pérez", "Gómez", "Martín", "Jiménez", "Ruiz", "Hernández", "Díaz", "Moreno",
  "Muñoz", "Álvarez", "Romero", "Alonso", "Gutiérrez", "Navarro", "Torres",
  "Domínguez", "Vázquez", "Ramos", "Gil", "Ramírez", "Serrano", "Blanco",
  "Suárez", "Molina", "Morales", "Ortega", "Delgado", "Castro", "Ortiz",
  "Rubio", "Marín", "Sanz", "Iglesias", "Medina", "Garrido", "Cortés",
  "Castillo", "Santos", "Lozano", "Guerrero", "Cano", "Prieto", "Méndez",
  "Herrera", "Aguilar", "Vega", "Campos", "Reyes", "Cruz", "Flores", "Vargas"
];

function getRandomElement<T>(array: readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Function to assign appropriate position based on department and shift
function getPositionForDepartmentAndShift(department: string, shift: string): string {
  const emergencyPositions = ["Emergency Operator 24h", "Emergency Coordinator", "Emergency Technician", "Emergency Dispatcher"];
  const callCenterPositions = ["Scheduled Teleoperator", "Emergency Teleoperator", "Call Center Supervisor", "Customer Service Agent"];
  const operationsPositions = ["Morning Shift Worker", "Afternoon Shift Worker", "Night Shift Worker", "Weekend Specialist"];
  const supportPositions = ["Technical Support", "Administrative Assistant", "Quality Supervisor", "Training Coordinator"];

  if (department === "Emergency Services") {
    if (shift === "Emergency 24h") {
      return getRandomElement(emergencyPositions.slice(0, 3)); // Emergency specific roles
    }
    return getRandomElement([...emergencyPositions, "Training Coordinator"]);
  }
  
  if (department === "Call Center") {
    if (shift === "Emergency 24h" || shift === "Night") {
      return "Emergency Teleoperator";
    }
    if (shift === "Scheduled" || shift === "Morning" || shift === "Afternoon") {
      return getRandomElement(["Scheduled Teleoperator", "Customer Service Agent"]);
    }
    return getRandomElement(callCenterPositions);
  }
  
  if (department === "Operations") {
    if (shift === "Morning") return "Morning Shift Worker";
    if (shift === "Afternoon") return "Afternoon Shift Worker";
    if (shift === "Night") return "Night Shift Worker";
    return getRandomElement(operationsPositions);
  }
  
  if (department === "Medical Support") {
    if (shift === "Emergency 24h") return "Emergency Dispatcher";
    return getRandomElement(["Quality Supervisor", "Training Coordinator"]);
  }
  
  if (department === "Telecommunications") {
    return "Technical Support";
  }
  
  // Default positions for other departments
  return getRandomElement(supportPositions);
}

function generateRandomUser(id: number): User {
  const firstName = getRandomElement(FIRST_NAMES);
  const lastName1 = getRandomElement(LAST_NAMES);
  const lastName2 = getRandomElement(LAST_NAMES);
  const name = `${firstName} ${lastName1} ${lastName2}`;
  
  // Generate email from name
  const emailName = firstName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const emailLastName = lastName1.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const email = `${emailName}.${emailLastName}@empresa.com`;
  
  // Random assignment of department, shift, etc.
  const department = getRandomElement(DEPARTMENTS);
  const shift = getRandomElement(SHIFTS);
  const workday = getRandomElement(WORKDAYS);
  const role = getRandomElement(ROLES);
  
  // Generate random hire date within last 10 years
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - Math.floor(Math.random() * 10));
  startDate.setMonth(Math.floor(Math.random() * 12));
  startDate.setDate(Math.floor(Math.random() * 28) + 1);
  
  // Get appropriate position based on department and shift
  const position = getPositionForDepartmentAndShift(department, shift);
  
  return {
    id: String(id),
    name,
    email,
    role,
    department,
    shift,
    workday,
    startDate,
    position,
    phone: `+34 ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 900 + 100)}`,
    seniority: Math.floor(Math.random() * 20) + 1
  };
}

export function generateUsers(count: number, startId: number = 1): User[] {
  const users: User[] = [];
  for (let i = 0; i < count; i++) {
    users.push(generateRandomUser(startId + i));
  }
  return users;
}
