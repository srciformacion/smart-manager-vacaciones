
import { format } from "date-fns";

// Types and interfaces for the data structure
interface EmployeeProfile {
  // Personal data
  nombre_completo: string;
  dni: string;
  email: string;
  telefono: string;
  fecha_entrada: string;
  tipo_jornada: string;
  grupo: string;
  
  // Shift assignment
  turno_base: string;
  calendario: DaySchedule[];
  
  // Vacation data
  vacaciones: string[];
  dias_recuperar: number;
  vacaciones_solicitadas: boolean;
  vacaciones_modificadas: boolean;
  
  // Hours computation
  horas_anuales: number;
  horas_antiguedad: number;
  ajuste_horas: number;
}

interface DaySchedule {
  fecha: string;
  turno: string;
}

// Constants for data generation
const NOMBRES = [
  "Antonio", "Manuel", "José", "Francisco", "David", "Juan", "José Antonio", "Javier",
  "Daniel", "José Luis", "Francisco Javier", "Carlos", "Jesús", "Alejandro", "Miguel",
  "José Manuel", "Rafael", "Miguel Ángel", "Pedro", "Pablo", "Ángel", "Sergio", "Fernando",
  "Jorge", "Luis", "Alberto", "Álvaro", "Juan Carlos", "Adrián", "Diego", "Juan José",
  "Raúl", "Iván", "Juan Antonio", "Rubén", "Enrique", "Oscar", "Ramón", "Vicente",
  "María", "Carmen", "Ana", "Isabel", "Dolores", "Pilar", "Teresa", "Josefa",
  "Margarita", "Cristina", "Laura", "Antonia", "Marta", "Elena", "Francisca", "Mercedes",
  "Rosa", "Rosario", "Manuela", "Raquel", "Emilia", "Victoria", "Julia", "Patricia",
  "Amparo", "Sofía", "Claudia", "Eva", "Gloria", "Susana", "Paula", "Rocío"
];

const APELLIDOS = [
  "García", "Rodríguez", "González", "Fernández", "López", "Martínez", "Sánchez", "Pérez",
  "Gómez", "Martín", "Jiménez", "Ruiz", "Hernández", "Díaz", "Moreno", "Álvarez",
  "Romero", "Alonso", "Gutiérrez", "Navarro", "Torres", "Domínguez", "Vázquez", "Ramos",
  "Gil", "Ramírez", "Serrano", "Blanco", "Molina", "Morales", "Suárez", "Ortega",
  "Delgado", "Castro", "Ortiz", "Rubio", "Marín", "Sanz", "Núñez", "Iglesias",
  "Medina", "Garrido", "Santos", "Castillo", "Cortes", "Lozano", "Guerrero", "Cano",
  "Prieto", "Méndez", "Cruz", "Calvo", "Gallego", "Vidal", "León", "Márquez",
  "Herrera", "Peña", "Flores", "Cabrera", "Campos", "Vega", "Fuentes", "Carrasco",
  "Díez", "Caballero", "Reyes", "Nieto", "Aguilar", "Pascual", "Santana", "Herrero",
  "Montero", "Hidalgo", "Lorenzo", "Giménez", "Ibáñez", "Ferrer", "Durán", "Santiago",
  "Benítez", "Mora", "Vicente", "Vargas", "Arias", "Carmona", "Crespo", "Román",
  "Pastor", "Soto", "Sáez", "Velasco", "Soler", "Moya", "Esteban", "Parra", "Bravo"
];

const TIPO_JORNADA = ["URGENTE_24H", "PROGRAMADO", "TELEOPERADOR", "NOCHE"];
const GRUPO = ["Localizado", "Programado", "Urgente 24h", "GES Sala"];
const TURNOS_BASE = ["M", "M1", "M2", "T", "T1", "T3", "11", "N", "24H"];

// Map turno_base to actual work hours
const TURNO_HORARIOS = {
  "M": "07:00-14:00",
  "M1": "08:00-15:00",
  "M2": "09:00-16:00",
  "T": "14:00-21:00",
  "T1": "15:00-22:00",
  "T3": "16:00-23:00",
  "11": "11:00-18:00",
  "N": "21:15-08:00",
  "24H": "08:00-08:00"
};

// Helper functions
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomDate(startYear: number, endYear: number): Date {
  const start = new Date(startYear, 0, 1).getTime();
  const end = new Date(endYear, 11, 31).getTime();
  return new Date(start + Math.random() * (end - start));
}

function formatDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

// Generate a valid Spanish DNI
function generateDNI(): string {
  const number = Math.floor(Math.random() * 100000000);
  const letters = "TRWAGMYFPDXBNJZSQVHLCKE";
  const letter = letters[number % 23];
  return `${number.toString().padStart(8, '0')}${letter}`;
}

// Generate a Spanish phone number
function generatePhone(): string {
  const prefixes = ["6", "7", "9"];
  const prefix = getRandomElement(prefixes);
  const number = Math.floor(Math.random() * 100000000);
  return `+34${prefix}${number.toString().padStart(8, '0')}`;
}

// Generate email from name
function generateEmail(name: string): string {
  const nameParts = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts[nameParts.length - 1];
  const domains = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.es", "empresa.es", "hospital.org", "clinica.es"];
  return `${firstName}.${lastName}@${getRandomElement(domains)}`;
}

// Generate calendar for year 2025
function generateCalendar(turnoBase: string): DaySchedule[] {
  const calendar: DaySchedule[] = [];
  const year = 2025;
  
  // Determine rest days based on turno_base
  const getRestDays = (turno: string): number[] => {
    switch(turno) {
      case "M": case "M1": case "M2": return [0, 6]; // Sunday and Saturday
      case "T": case "T1": case "T3": return [0, 6]; // Sunday and Saturday
      case "11": return [0, 6]; // Sunday and Saturday
      case "N": return [0, 1]; // Sunday and Monday
      case "24H": return [1, 2, 3, 4]; // Monday to Thursday (works weekends)
      default: return [0, 6];
    }
  };
  
  const restDays = getRestDays(turnoBase);
  
  // Generate days for the entire year
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
      
      calendar.push({
        fecha: formatDate(date),
        turno: restDays.includes(dayOfWeek) ? "LIBRE" : turnoBase
      });
    }
  }
  
  return calendar;
}

// Generate vacation days ensuring they don't start on rest days
function generateVacations(calendar: DaySchedule[]): [string[], number] {
  let vacationDays: string[] = [];
  let diasRecuperar = 0;
  
  // Decide if one or two blocks
  const twoBlocks = Math.random() > 0.5;
  
  if (twoBlocks) {
    // Two blocks of vacations
    const firstBlockSize = Math.floor(Math.random() * 10) + 10; // 10-20 days
    const secondBlockSize = 32 - firstBlockSize;
    
    // First block - try to find start date not on a rest day
    let firstBlockStart = -1;
    let attempts = 0;
    while (attempts < 100) {
      const potentialStart = Math.floor(Math.random() * 150); // First half of year
      if (calendar[potentialStart].turno !== "LIBRE") {
        firstBlockStart = potentialStart;
        break;
      }
      attempts++;
    }
    
    // If we couldn't find a non-rest day, pick any day and increment diasRecuperar
    if (firstBlockStart === -1) {
      firstBlockStart = Math.floor(Math.random() * 150);
      diasRecuperar++;
    }
    
    // Add first block days
    for (let i = 0; i < firstBlockSize; i++) {
      if (firstBlockStart + i < calendar.length) {
        vacationDays.push(calendar[firstBlockStart + i].fecha);
      }
    }
    
    // Second block - try to find start date not on a rest day
    let secondBlockStart = -1;
    attempts = 0;
    while (attempts < 100) {
      const potentialStart = Math.floor(Math.random() * 100) + 200; // Second half of year
      if (calendar[potentialStart].turno !== "LIBRE") {
        secondBlockStart = potentialStart;
        break;
      }
      attempts++;
    }
    
    // If we couldn't find a non-rest day, pick any day and increment diasRecuperar
    if (secondBlockStart === -1) {
      secondBlockStart = Math.floor(Math.random() * 100) + 200;
      diasRecuperar++;
    }
    
    // Add second block days
    for (let i = 0; i < secondBlockSize; i++) {
      if (secondBlockStart + i < calendar.length) {
        vacationDays.push(calendar[secondBlockStart + i].fecha);
      }
    }
  } else {
    // One block of vacations - 32 days
    let blockStart = -1;
    let attempts = 0;
    while (attempts < 100) {
      const potentialStart = Math.floor(Math.random() * (calendar.length - 32));
      if (calendar[potentialStart].turno !== "LIBRE") {
        blockStart = potentialStart;
        break;
      }
      attempts++;
    }
    
    // If we couldn't find a non-rest day, pick any day and increment diasRecuperar
    if (blockStart === -1) {
      blockStart = Math.floor(Math.random() * (calendar.length - 32));
      diasRecuperar++;
    }
    
    // Add days
    for (let i = 0; i < 32; i++) {
      if (blockStart + i < calendar.length) {
        vacationDays.push(calendar[blockStart + i].fecha);
      }
    }
  }
  
  // Count how many vacation days fall on rest days and might need recovery
  const restDaysInVacation = vacationDays.filter(
    date => calendar.find(day => day.fecha === date)?.turno === "LIBRE"
  ).length;
  
  // Randomly decide whether to recover these days
  if (restDaysInVacation > 0 && Math.random() > 0.7) {
    diasRecuperar = Math.min(2, restDaysInVacation);
  }
  
  return [vacationDays, diasRecuperar];
}

// Main function to generate employee data
export function generateEmployeeData(count: number = 300): EmployeeProfile[] {
  const employees: EmployeeProfile[] = [];
  
  for (let i = 0; i < count; i++) {
    // Generate personal info
    const nombre = getRandomElement(NOMBRES);
    const apellido1 = getRandomElement(APELLIDOS);
    const apellido2 = getRandomElement(APELLIDOS);
    const nombreCompleto = `${nombre} ${apellido1} ${apellido2}`;
    const dni = generateDNI();
    const email = generateEmail(nombreCompleto);
    const telefono = generatePhone();
    
    // Work info
    const fechaEntrada = formatDate(getRandomDate(2000, 2024));
    const tipoJornada = getRandomElement(TIPO_JORNADA);
    const grupo = getRandomElement(GRUPO);
    const turnoBase = getRandomElement(TURNOS_BASE);
    
    // Generate calendar and vacations
    const calendario = generateCalendar(turnoBase);
    const [vacaciones, diasRecuperar] = generateVacations(calendario);
    
    // Calculate years of seniority
    const startYear = new Date(fechaEntrada).getFullYear();
    const yearsOfService = 2025 - startYear;
    const horasAntiguedad = 8 * yearsOfService;
    
    // Create employee profile
    const employee: EmployeeProfile = {
      nombre_completo: nombreCompleto,
      dni,
      email,
      telefono,
      fecha_entrada: fechaEntrada,
      tipo_jornada: tipoJornada,
      grupo,
      
      turno_base: turnoBase,
      calendario,
      
      vacaciones,
      dias_recuperar: diasRecuperar,
      vacaciones_solicitadas: Math.random() > 0.1, // 90% have requested
      vacaciones_modificadas: Math.random() < 0.2, // 20% have been modified
      
      horas_anuales: 1780,
      horas_antiguedad: horasAntiguedad,
      ajuste_horas: [-8, 0, 8][Math.floor(Math.random() * 3)] // -8, 0, or +8
    };
    
    employees.push(employee);
  }
  
  return employees;
}

// Function to export data as JSON
export function exportAsJson(employees: EmployeeProfile[]): string {
  return JSON.stringify(employees, null, 2);
}

// Function to export data as CSV
export function exportAsCsv(employees: EmployeeProfile[]): string {
  // Handle complex fields that need special formatting
  const processedEmployees = employees.map(employee => {
    const flatEmployee = {
      ...employee,
      calendario: JSON.stringify(employee.calendario),
      vacaciones: JSON.stringify(employee.vacaciones)
    };
    return flatEmployee;
  });
  
  // Get headers
  const headers = Object.keys(processedEmployees[0]);
  
  // Create CSV content
  const csvRows = [
    headers.join(','),
    ...processedEmployees.map(emp => {
      return headers.map(header => {
        const value = emp[header as keyof typeof emp];
        // Escape strings with commas
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(',');
    })
  ];
  
  return csvRows.join('\n');
}
