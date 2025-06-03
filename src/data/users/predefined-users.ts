
import { User } from "@/types";

export const exampleUser: User = {
  id: "1",
  name: "Ana García López",
  email: "ana.garcia@empresa.com",
  role: "hr",
  department: "Human Resources",
  shift: "Morning",
  workday: "L-V",
  startDate: new Date("2020-01-15"),
  position: "Gerente de RRHH",
  phone: "+34 600 123 456",
  seniority: 4
};

export const predefinedWorkers: User[] = [
  // Emergency Services 24h
  {
    id: "2",
    name: "Carlos Rodríguez Martín",
    email: "carlos.rodriguez@empresa.com",
    role: "worker",
    department: "Emergency Services",
    shift: "Emergency 24h",
    workday: "24h Cycle",
    startDate: new Date("2019-03-10"),
    position: "Emergency Operator 24h",
    phone: "+34 600 234 567",
    seniority: 5
  },
  {
    id: "3",
    name: "María González Fernández",
    email: "maria.gonzalez@empresa.com",
    role: "worker",
    department: "Emergency Services",
    shift: "Emergency 24h",
    workday: "Rotativo",
    startDate: new Date("2021-06-01"),
    position: "Emergency Coordinator",
    phone: "+34 600 345 678",
    seniority: 3
  },
  {
    id: "4",
    name: "José Martínez Sánchez",
    email: "jose.martinez@empresa.com",
    role: "worker",
    department: "Emergency Services",
    shift: "Emergency 24h",
    workday: "24h Cycle",
    startDate: new Date("2018-09-15"),
    position: "Emergency Technician",
    phone: "+34 600 456 789",
    seniority: 6
  },
  
  // Teleoperators - Scheduled
  {
    id: "5",
    name: "Laura López Pérez",
    email: "laura.lopez@empresa.com",
    role: "worker",
    department: "Call Center",
    shift: "Scheduled",
    workday: "L-V",
    startDate: new Date("2022-01-10"),
    position: "Scheduled Teleoperator",
    phone: "+34 600 567 890",
    seniority: 2
  },
  {
    id: "6",
    name: "Miguel Fernández Torres",
    email: "miguel.fernandez@empresa.com",
    role: "worker",
    department: "Call Center",
    shift: "Scheduled",
    workday: "L-V",
    startDate: new Date("2021-05-20"),
    position: "Scheduled Teleoperator",
    phone: "+34 600 678 901",
    seniority: 3
  },
  {
    id: "7",
    name: "Carmen Ruiz Morales",
    email: "carmen.ruiz@empresa.com",
    role: "worker",
    department: "Call Center",
    shift: "Morning",
    workday: "L-V",
    startDate: new Date("2020-08-15"),
    position: "Call Center Supervisor",
    phone: "+34 600 789 012",
    seniority: 4
  },
  
  // Teleoperators - Emergency
  {
    id: "8",
    name: "Antonio Jiménez García",
    email: "antonio.jimenez@empresa.com",
    role: "worker",
    department: "Call Center",
    shift: "Emergency 24h",
    workday: "Rotativo",
    startDate: new Date("2019-11-01"),
    position: "Emergency Teleoperator",
    phone: "+34 600 890 123",
    seniority: 5
  },
  {
    id: "9",
    name: "Isabel Martín Hernández",
    email: "isabel.martin@empresa.com",
    role: "worker",
    department: "Call Center",
    shift: "Night",
    workday: "Rotativo",
    startDate: new Date("2020-02-14"),
    position: "Emergency Teleoperator",
    phone: "+34 600 901 234",
    seniority: 4
  },
  
  // Programmed Workers - Morning
  {
    id: "10",
    name: "Francisco López Díaz",
    email: "francisco.lopez@empresa.com",
    role: "worker",
    department: "Operations",
    shift: "Morning",
    workday: "L-V",
    startDate: new Date("2021-09-01"),
    position: "Morning Shift Worker",
    phone: "+34 600 012 345",
    seniority: 3
  },
  {
    id: "11",
    name: "Pilar Sánchez Romero",
    email: "pilar.sanchez@empresa.com",
    role: "worker",
    department: "Operations",
    shift: "Morning",
    workday: "L-S",
    startDate: new Date("2020-04-10"),
    position: "Morning Shift Worker",
    phone: "+34 600 123 456",
    seniority: 4
  },
  
  // Programmed Workers - Afternoon
  {
    id: "12",
    name: "Manuel García Vázquez",
    email: "manuel.garcia@empresa.com",
    role: "worker",
    department: "Operations",
    shift: "Afternoon",
    workday: "L-V",
    startDate: new Date("2022-03-05"),
    position: "Afternoon Shift Worker",
    phone: "+34 600 234 567",
    seniority: 2
  },
  {
    id: "13",
    name: "Rosa Fernández Castro",
    email: "rosa.fernandez@empresa.com",
    role: "worker",
    department: "Operations",
    shift: "Afternoon",
    workday: "L-S",
    startDate: new Date("2019-07-20"),
    position: "Afternoon Shift Worker",
    phone: "+34 600 345 678",
    seniority: 5
  },
  
  // Programmed Workers - Night
  {
    id: "14",
    name: "Juan Morales Prieto",
    email: "juan.morales@empresa.com",
    role: "worker",
    department: "Operations",
    shift: "Night",
    workday: "L-V",
    startDate: new Date("2021-01-15"),
    position: "Night Shift Worker",
    phone: "+34 600 456 789",
    seniority: 3
  },
  {
    id: "15",
    name: "Mercedes Torres Aguilar",
    email: "mercedes.torres@empresa.com",
    role: "worker",
    department: "Operations",
    shift: "Night",
    workday: "Rotativo",
    startDate: new Date("2020-06-30"),
    position: "Night Shift Worker",
    phone: "+34 600 567 890",
    seniority: 4
  },
  
  // Medical Support
  {
    id: "16",
    name: "Rafael Molina Serrano",
    email: "rafael.molina@empresa.com",
    role: "worker",
    department: "Medical Support",
    shift: "Emergency 24h",
    workday: "24h Cycle",
    startDate: new Date("2018-12-01"),
    position: "Emergency Dispatcher",
    phone: "+34 600 678 901",
    seniority: 6
  },
  {
    id: "17",
    name: "Concepción Ruiz Blanco",
    email: "concepcion.ruiz@empresa.com",
    role: "worker",
    department: "Medical Support",
    shift: "Morning",
    workday: "L-V",
    startDate: new Date("2021-11-10"),
    position: "Quality Supervisor",
    phone: "+34 600 789 012",
    seniority: 3
  },
  
  // Telecommunications
  {
    id: "18",
    name: "David Herrera Ramos",
    email: "david.herrera@empresa.com",
    role: "worker",
    department: "Telecommunications",
    shift: "On-call",
    workday: "Flexible",
    startDate: new Date("2020-10-05"),
    position: "Technical Support",
    phone: "+34 600 890 123",
    seniority: 4
  },
  {
    id: "19",
    name: "Dolores Méndez Ortega",
    email: "dolores.mendez@empresa.com",
    role: "worker",
    department: "Call Center",
    shift: "Afternoon",
    workday: "L-V",
    startDate: new Date("2019-04-25"),
    position: "Customer Service Agent",
    phone: "+34 600 901 234",
    seniority: 5
  },
  {
    id: "20",
    name: "Javier Castillo Navarro",
    email: "javier.castillo@empresa.com",
    role: "worker",
    department: "Emergency Services",
    shift: "Morning",
    workday: "L-S",
    startDate: new Date("2022-08-12"),
    position: "Training Coordinator",
    phone: "+34 600 012 345",
    seniority: 2
  }
];
