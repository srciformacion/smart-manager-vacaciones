
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
    shift: "Urgencias 24h",
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
    shift: "Urgencias 12h",
    workday: "Rotativo",
    startDate: new Date("2021-06-01"),
    position: "Emergency Operator 12h",
    phone: "+34 600 345 678",
    seniority: 3
  },
  {
    id: "4",
    name: "José Martínez Sánchez",
    email: "jose.martinez@empresa.com",
    role: "worker",
    department: "Emergency Services",
    shift: "Localizado",
    workday: "24h Cycle",
    startDate: new Date("2018-09-15"),
    position: "Localizado Emergency",
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
    shift: "Programado Mañana",
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
    shift: "Programado Tarde",
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
    shift: "Programado Noche",
    workday: "L-V",
    startDate: new Date("2020-08-15"),
    position: "Scheduled Teleoperator",
    phone: "+34 600 789 012",
    seniority: 4
  },
  
  // Teleoperators - Rotativo
  {
    id: "8",
    name: "Antonio Jiménez García",
    email: "antonio.jimenez@empresa.com",
    role: "worker",
    department: "Call Center",
    shift: "Teleoperador Rotativo Mañana",
    workday: "Rotativo",
    startDate: new Date("2019-11-01"),
    position: "Teleoperador Rotativo",
    phone: "+34 600 890 123",
    seniority: 5
  },
  {
    id: "9",
    name: "Isabel Martín Hernández",
    email: "isabel.martin@empresa.com",
    role: "worker",
    department: "Call Center",
    shift: "Teleoperador Rotativo Tarde",
    workday: "Rotativo",
    startDate: new Date("2020-02-14"),
    position: "Teleoperador Rotativo",
    phone: "+34 600 901 234",
    seniority: 4
  },
  {
    id: "10",
    name: "Raquel Soto Jiménez",
    email: "raquel.soto@empresa.com",
    role: "worker",
    department: "Call Center",
    shift: "Teleoperador Rotativo Noche",
    workday: "Rotativo",
    startDate: new Date("2021-03-12"),
    position: "Teleoperador Rotativo",
    phone: "+34 600 112 233",
    seniority: 3
  },
  
  // Emergency Teleoperators
  {
    id: "11",
    name: "Fernando López Díaz",
    email: "fernando.lopez@empresa.com",
    role: "worker",
    department: "Call Center",
    shift: "Emergency 24h",
    workday: "24h Cycle",
    startDate: new Date("2019-08-20"),
    position: "Emergency Teleoperator",
    phone: "+34 600 334 455",
    seniority: 4
  },
  {
    id: "12",
    name: "Pilar Sánchez Romero",
    email: "pilar.sanchez@empresa.com",
    role: "worker",
    department: "Call Center",
    shift: "Emergency 12h",
    workday: "Rotativo",
    startDate: new Date("2020-11-05"),
    position: "Emergency Teleoperator",
    phone: "+34 600 556 677",
    seniority: 3
  },
  
  // Programmed Workers - Morning
  {
    id: "13",
    name: "Manuel García Vázquez",
    email: "manuel.garcia@empresa.com",
    role: "worker",
    department: "Operations",
    shift: "Programado Mañana",
    workday: "L-V",
    startDate: new Date("2022-03-05"),
    position: "Morning Shift Worker",
    phone: "+34 600 778 899",
    seniority: 2
  },
  {
    id: "14",
    name: "Rosa Fernández Castro",
    email: "rosa.fernandez@empresa.com",
    role: "worker",
    department: "Operations",
    shift: "Programado Mañana",
    workday: "L-S",
    startDate: new Date("2019-07-20"),
    position: "Morning Shift Worker",
    phone: "+34 600 990 011",
    seniority: 5
  },
  
  // Programmed Workers - Afternoon
  {
    id: "15",
    name: "Juan Morales Prieto",
    email: "juan.morales@empresa.com",
    role: "worker",
    department: "Operations",
    shift: "Programado Tarde",
    workday: "L-V",
    startDate: new Date("2021-01-15"),
    position: "Afternoon Shift Worker",
    phone: "+34 600 223 344",
    seniority: 3
  },
  {
    id: "16",
    name: "Mercedes Torres Aguilar",
    email: "mercedes.torres@empresa.com",
    role: "worker",
    department: "Operations",
    shift: "Programado Tarde",
    workday: "L-S",
    startDate: new Date("2020-06-30"),
    position: "Afternoon Shift Worker",
    phone: "+34 600 445 566",
    seniority: 4
  },
  
  // Programmed Workers - Night
  {
    id: "17",
    name: "Rafael Molina Serrano",
    email: "rafael.molina@empresa.com",
    role: "worker",
    department: "Operations",
    shift: "Programado Noche",
    workday: "L-V",
    startDate: new Date("2018-12-01"),
    position: "Night Shift Worker",
    phone: "+34 600 667 788",
    seniority: 6
  },
  {
    id: "18",
    name: "Concepción Ruiz Blanco",
    email: "concepcion.ruiz@empresa.com",
    role: "worker",
    department: "Operations",
    shift: "Programado Noche",
    workday: "Rotativo",
    startDate: new Date("2021-11-10"),
    position: "Night Shift Worker",
    phone: "+34 600 889 900",
    seniority: 3
  },
  
  // Medical Support
  {
    id: "19",
    name: "David Herrera Ramos",
    email: "david.herrera@empresa.com",
    role: "worker",
    department: "Medical Support",
    shift: "Urgencias 24h",
    workday: "24h Cycle",
    startDate: new Date("2019-04-15"),
    position: "Emergency Dispatcher",
    phone: "+34 600 011 122",
    seniority: 5
  },
  {
    id: "20",
    name: "Dolores Méndez Ortega",
    email: "dolores.mendez@empresa.com",
    role: "worker",
    department: "Medical Support",
    shift: "Morning",
    workday: "L-V",
    startDate: new Date("2020-09-25"),
    position: "Quality Supervisor",
    phone: "+34 600 233 344",
    seniority: 4
  },
  
  // Telecommunications
  {
    id: "21",
    name: "Javier Castillo Navarro",
    email: "javier.castillo@empresa.com",
    role: "worker",
    department: "Telecommunications",
    shift: "On-call",
    workday: "Flexible",
    startDate: new Date("2020-10-05"),
    position: "Technical Support",
    phone: "+34 600 455 566",
    seniority: 4
  },
  {
    id: "22",
    name: "Beatriz Romero Gil",
    email: "beatriz.romero@empresa.com",
    role: "worker",
    department: "Telecommunications",
    shift: "Localizado",
    workday: "Flexible",
    startDate: new Date("2021-02-18"),
    position: "Technical Support",
    phone: "+34 600 677 788",
    seniority: 3
  }
];
