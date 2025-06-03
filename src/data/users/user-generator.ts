
import { User } from "@/types";
import { DEPARTMENTS, SHIFTS, WORKDAYS, ROLES, POSITIONS } from "./departments";

const NOMBRES_MASCULINOS = [
  "Antonio", "Manuel", "José", "Francisco", "David", "Juan", "José Antonio", "Javier",
  "Daniel", "José Luis", "Francisco Javier", "Carlos", "Jesús", "Alejandro", "Miguel",
  "José Manuel", "Rafael", "Miguel Ángel", "Pedro", "Pablo", "Ángel", "Sergio", "Fernando",
  "Jorge", "Luis", "Alberto", "Álvaro", "Juan Carlos", "Adrián", "Diego", "Juan José",
  "Raúl", "Iván", "Juan Antonio", "Rubén", "Enrique", "Óscar", "Ramón", "Vicente",
  "Roberto", "Andrés", "Eduardo", "Gonzalo", "Víctor", "Ignacio", "Marco", "Joaquín"
];

const NOMBRES_FEMENINOS = [
  "María", "Carmen", "Ana", "Isabel", "Dolores", "Pilar", "Teresa", "Josefa",
  "Margarita", "Cristina", "Laura", "Antonia", "Marta", "Elena", "Francisca", "Mercedes",
  "Rosa", "Rosario", "Manuela", "Raquel", "Emilia", "Victoria", "Julia", "Patricia",
  "Amparo", "Sofía", "Claudia", "Eva", "Gloria", "Susana", "Paula", "Rocío",
  "Beatriz", "Yolanda", "Silvia", "Montserrat", "Esperanza", "Inmaculada", "Nuria", "Lucía"
];

const APELLIDOS = [
  "García", "Rodríguez", "González", "Fernández", "López", "Martínez", "Sánchez", "Pérez",
  "Gómez", "Martín", "Jiménez", "Ruiz", "Hernández", "Díaz", "Moreno", "Álvarez",
  "Romero", "Alonso", "Gutiérrez", "Navarro", "Torres", "Domínguez", "Vázquez", "Ramos",
  "Gil", "Ramírez", "Serrano", "Blanco", "Molina", "Morales", "Suárez", "Ortega",
  "Delgado", "Castro", "Ortiz", "Rubio", "Marín", "Sanz", "Núñez", "Iglesias",
  "Medina", "Garrido", "Santos", "Castillo", "Cortés", "Lozano", "Guerrero", "Cano",
  "Prieto", "Méndez", "Cruz", "Calvo", "Gallego", "Vidal", "León", "Márquez",
  "Herrera", "Peña", "Flores", "Cabrera", "Campos", "Vega", "Fuentes", "Carrasco"
];

function getRandomElement<T>(array: readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Función para asignar posición apropiada según departamento y turno
function getPositionForDepartmentAndShift(department: string, shift: string): string {
  const emergencyPositions = ["Operador de Urgencias 24h", "Operador de Urgencias 12h", "Coordinador de Urgencias", "Técnico de Urgencias", "Dispatcher de Emergencias", "Técnico Localizado Urgencias"];
  const callCenterPositions = ["Teleoperadora Programada", "Teleoperador de Urgencias", "Teleoperadora Rotativa", "Supervisor de Call Center", "Agente de Atención al Cliente"];
  const operationsPositions = ["Operario Turno Mañana", "Operario Turno Tarde", "Operario Turno Noche", "Especialista de Fin de Semana"];
  const supportPositions = ["Técnico de Soporte", "Auxiliar Administrativo", "Supervisor de Calidad", "Coordinador de Formación"];

  if (department === "Emergency Services") {
    if (shift === "Urgencias 24h") {
      return "Operador de Urgencias 24h";
    }
    if (shift === "Urgencias 12h") {
      return "Operador de Urgencias 12h";
    }
    if (shift === "Localizado") {
      return "Técnico Localizado Urgencias";
    }
    return getRandomElement(emergencyPositions);
  }
  
  if (department === "Call Center") {
    if (shift === "Emergency 24h" || shift === "Emergency 12h") {
      return "Teleoperador de Urgencias";
    }
    if (shift.includes("Rotativo")) {
      return "Teleoperadora Rotativa";
    }
    if (shift.includes("Programado") || shift === "Scheduled") {
      return "Teleoperadora Programada";
    }
    return getRandomElement(callCenterPositions);
  }
  
  if (department === "Operations") {
    if (shift === "Programado Mañana" || shift === "Morning") return "Operario Turno Mañana";
    if (shift === "Programado Tarde" || shift === "Afternoon") return "Operario Turno Tarde";
    if (shift === "Programado Noche" || shift === "Night") return "Operario Turno Noche";
    return getRandomElement(operationsPositions);
  }
  
  if (department === "Medical Support") {
    if (shift === "Urgencias 24h" || shift === "Emergency 24h") return "Técnico Emergencias Médicas";
    return getRandomElement(["Supervisor de Calidad Sanitaria", "Coordinador de Formación Médica"]);
  }
  
  if (department === "Telecommunications") {
    return "Técnico de Soporte IT";
  }
  
  // Posiciones por defecto para otros departamentos
  return getRandomElement(supportPositions);
}

function generateRandomUser(id: number): User {
  const ismale = Math.random() > 0.5;
  const firstName = ismale ? getRandomElement(NOMBRES_MASCULINOS) : getRandomElement(NOMBRES_FEMENINOS);
  const lastName1 = getRandomElement(APELLIDOS);
  const lastName2 = getRandomElement(APELLIDOS);
  const name = `${firstName} ${lastName1} ${lastName2}`;
  
  // Generar email a partir del nombre
  const emailName = firstName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const emailLastName = lastName1.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const email = `${emailName}.${emailLastName}@empresa.com`;
  
  // Asignación aleatoria de departamento, turno, etc.
  const department = getRandomElement(DEPARTMENTS);
  const shift = getRandomElement(SHIFTS);
  const workday = getRandomElement(WORKDAYS);
  const role = getRandomElement(ROLES);
  
  // Generar fecha de contratación aleatoria en los últimos 10 años
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - Math.floor(Math.random() * 10));
  startDate.setMonth(Math.floor(Math.random() * 12));
  startDate.setDate(Math.floor(Math.random() * 28) + 1);
  
  // Obtener posición apropiada según departamento y turno
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
