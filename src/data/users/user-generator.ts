
import { User } from "@/types";
import { DEPARTMENTS, SHIFTS, WORKDAYS, ROLES } from "./departments";

const FIRST_NAMES = [
  "Ana", "Carlos", "María", "José", "Laura", "Miguel", "Carmen", "Antonio", 
  "Isabel", "Francisco", "Pilar", "Manuel", "Rosa", "Juan", "Mercedes",
  "Rafael", "Concepción", "David", "Dolores", "Javier", "Josefa", "Daniel",
  "Teresa", "Alejandro", "Antonia", "Pedro", "Francisca", "Adrián", "Cristina",
  "Óscar", "Lucía", "Rubén", "Julia", "Álvaro", "Montserrat", "Sergio", "Esperanza",
  "Pablo", "Amparo", "Jorge", "Inmaculada", "Alberto", "Susana", "Roberto",
  "Elena", "Ignacio", "Beatriz", "Marco", "Yolanda", "Víctor", "Margarita"
];

const LAST_NAMES = [
  "García", "Rodríguez", "González", "Fernández", "López", "Martínez", "Sánchez",
  "Pérez", "Gómez", "Martín", "Jiménez", "Ruiz", "Hernández", "Díaz", "Moreno",
  "Muñoz", "Álvarez", "Romero", "Alonso", "Gutiérrez", "Navarro", "Torres",
  "Domínguez", "Vázquez", "Ramos", "Gil", "Ramírez", "Serrano", "Blanco",
  "Suárez", "Molina", "Morales", "Ortega", "Delgado", "Castro", "Ortiz",
  "Rubio", "Marín", "Sanz", "Iglesias", "Medina", "Garrido", "Cortés",
  "Castillo", "Santos", "Lozano", "Guerrero", "Cano", "Prieto", "Méndez"
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
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
  
  // Generate employee number
  const employeeNumber = `EMP${String(id).padStart(4, '0')}`;
  
  // Random assignment of department, shift, etc.
  const department = getRandomElement(DEPARTMENTS);
  const shift = getRandomElement(SHIFTS);
  const workday = getRandomElement(WORKDAYS);
  const role = getRandomElement(ROLES);
  
  // Generate random hire date within last 10 years
  const hireDate = new Date();
  hireDate.setFullYear(hireDate.getFullYear() - Math.floor(Math.random() * 10));
  hireDate.setMonth(Math.floor(Math.random() * 12));
  hireDate.setDate(Math.floor(Math.random() * 28) + 1);
  
  return {
    id: String(id),
    name,
    email,
    role,
    department,
    shift,
    workday,
    employeeNumber,
    hireDate: hireDate.toISOString().split('T')[0],
    position: `${department} - ${shift}`,
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
