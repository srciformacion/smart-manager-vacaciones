
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
  position: "Gerente de Recursos Humanos",
  phone: "+34 600 123 456",
  seniority: 4
};

export const predefinedWorkers: User[] = [
  // Servicios de Urgencias 24h
  {
    id: "2",
    name: "Carlos Rodríguez Martín",
    email: "carlos.rodriguez@empresa.com",
    role: "worker",
    department: "Emergency Services",
    shift: "Urgencias 24h",
    workday: "24h Cycle",
    startDate: new Date("2019-03-10"),
    position: "Operador de Urgencias 24h",
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
    position: "Operadora de Urgencias 12h",
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
    position: "Técnico Localizado Urgencias",
    phone: "+34 600 456 789",
    seniority: 6
  },
  {
    id: "5",
    name: "Francisco Jiménez García",
    email: "francisco.jimenez@empresa.com",
    role: "worker",
    department: "Emergency Services",
    shift: "Urgencias 24h",
    workday: "24h Cycle",
    startDate: new Date("2020-11-20"),
    position: "Coordinador de Urgencias",
    phone: "+34 600 567 890",
    seniority: 4
  },
  
  // Teleoperadoras - Programado
  {
    id: "6",
    name: "Laura López Pérez",
    email: "laura.lopez@empresa.com",
    role: "worker",
    department: "Call Center",
    shift: "Programado Mañana",
    workday: "L-V",
    startDate: new Date("2022-01-10"),
    position: "Teleoperadora Programada",
    phone: "+34 600 678 901",
    seniority: 2
  },
  {
    id: "7",
    name: "Miguel Fernández Torres",
    email: "miguel.fernandez@empresa.com",
    role: "worker",
    department: "Call Center",
    shift: "Programado Tarde",
    workday: "L-V",
    startDate: new Date("2021-05-20"),
    position: "Teleoperador Programado",
    phone: "+34 600 789 012",
    seniority: 3
  },
  {
    id: "8",
    name: "Carmen Ruiz Morales",
    email: "carmen.ruiz@empresa.com",
    role: "worker",
    department: "Call Center",
    shift: "Programado Noche",
    workday: "L-V",
    startDate: new Date("2020-08-15"),
    position: "Teleoperadora Programada Nocturna",
    phone: "+34 600 890 123",
    seniority: 4
  },
  {
    id: "9",
    name: "Patricia Sánchez Ruiz",
    email: "patricia.sanchez@empresa.com",
    role: "worker",
    department: "Call Center",
    shift: "Programado Mañana",
    workday: "L-S",
    startDate: new Date("2021-03-08"),
    position: "Supervisora Teleoperación",
    phone: "+34 600 901 234",
    seniority: 3
  },
  
  // Teleoperadoras - Rotativo
  {
    id: "10",
    name: "Antonio Jiménez García",
    email: "antonio.jimenez@empresa.com",
    role: "worker",
    department: "Call Center",
    shift: "Teleoperador Rotativo Mañana",
    workday: "Rotativo",
    startDate: new Date("2019-11-01"),
    position: "Teleoperador Rotativo",
    phone: "+34 600 112 233",
    seniority: 5
  },
  {
    id: "11",
    name: "Isabel Martín Hernández",
    email: "isabel.martin@empresa.com",
    role: "worker",
    department: "Call Center",
    shift: "Teleoperador Rotativo Tarde",
    workday: "Rotativo",
    startDate: new Date("2020-02-14"),
    position: "Teleoperadora Rotativa",
    phone: "+34 600 334 455",
    seniority: 4
  },
  {
    id: "12",
    name: "Raquel Soto Jiménez",
    email: "raquel.soto@empresa.com",
    role: "worker",
    department: "Call Center",
    shift: "Teleoperador Rotativo Noche",
    workday: "Rotativo",
    startDate: new Date("2021-03-12"),
    position: "Teleoperadora Rotativa Nocturna",
    phone: "+34 600 556 677",
    seniority: 3
  },
  {
    id: "13",
    name: "Javier Moreno Castillo",
    email: "javier.moreno@empresa.com",
    role: "worker",
    department: "Call Center",
    shift: "Teleoperador Rotativo Mañana",
    workday: "Rotativo",
    startDate: new Date("2020-07-18"),
    position: "Teleoperador Rotativo Senior",
    phone: "+34 600 778 899",
    seniority: 4
  },
  
  // Teleoperadoras de Urgencias
  {
    id: "14",
    name: "Fernando López Díaz",
    email: "fernando.lopez@empresa.com",
    role: "worker",
    department: "Call Center",
    shift: "Emergency 24h",
    workday: "24h Cycle",
    startDate: new Date("2019-08-20"),
    position: "Teleoperador de Urgencias 24h",
    phone: "+34 600 990 011",
    seniority: 4
  },
  {
    id: "15",
    name: "Pilar Sánchez Romero",
    email: "pilar.sanchez@empresa.com",
    role: "worker",
    department: "Call Center",
    shift: "Emergency 12h",
    workday: "Rotativo",
    startDate: new Date("2020-11-05"),
    position: "Teleoperadora de Urgencias 12h",
    phone: "+34 600 223 344",
    seniority: 3
  },
  {
    id: "16",
    name: "Elena Vázquez Herrera",
    email: "elena.vazquez@empresa.com",
    role: "worker",
    department: "Call Center",
    shift: "Emergency 24h",
    workday: "24h Cycle",
    startDate: new Date("2018-12-03"),
    position: "Coordinadora Teleoperación Urgencias",
    phone: "+34 600 445 566",
    seniority: 5
  },
  
  // Trabajadores Programados - Mañana
  {
    id: "17",
    name: "Manuel García Vázquez",
    email: "manuel.garcia@empresa.com",
    role: "worker",
    department: "Operations",
    shift: "Programado Mañana",
    workday: "L-V",
    startDate: new Date("2022-03-05"),
    position: "Operario Turno Mañana",
    phone: "+34 600 667 788",
    seniority: 2
  },
  {
    id: "18",
    name: "Rosa Fernández Castro",
    email: "rosa.fernandez@empresa.com",
    role: "worker",
    department: "Operations",
    shift: "Programado Mañana",
    workday: "L-S",
    startDate: new Date("2019-07-20"),
    position: "Técnica Operaciones Mañana",
    phone: "+34 600 889 900",
    seniority: 5
  },
  {
    id: "19",
    name: "Alberto Morales Vega",
    email: "alberto.morales@empresa.com",
    role: "worker",
    department: "Operations",
    shift: "Programado Mañana",
    workday: "L-V",
    startDate: new Date("2021-09-12"),
    position: "Especialista Programado",
    phone: "+34 600 011 122",
    seniority: 3
  },
  
  // Trabajadores Programados - Tarde
  {
    id: "20",
    name: "Juan Morales Prieto",
    email: "juan.morales@empresa.com",
    role: "worker",
    department: "Operations",
    shift: "Programado Tarde",
    workday: "L-V",
    startDate: new Date("2021-01-15"),
    position: "Operario Turno Tarde",
    phone: "+34 600 233 344",
    seniority: 3
  },
  {
    id: "21",
    name: "Mercedes Torres Aguilar",
    email: "mercedes.torres@empresa.com",
    role: "worker",
    department: "Operations",
    shift: "Programado Tarde",
    workday: "L-S",
    startDate: new Date("2020-06-30"),
    position: "Técnica Operaciones Tarde",
    phone: "+34 600 455 566",
    seniority: 4
  },
  {
    id: "22",
    name: "Sergio Díez Navarro",
    email: "sergio.diez@empresa.com",
    role: "worker",
    department: "Operations",
    shift: "Programado Tarde",
    workday: "L-V",
    startDate: new Date("2020-10-22"),
    position: "Coordinador Tarde",
    phone: "+34 600 677 788",
    seniority: 4
  },
  
  // Trabajadores Programados - Noche
  {
    id: "23",
    name: "Rafael Molina Serrano",
    email: "rafael.molina@empresa.com",
    role: "worker",
    department: "Operations",
    shift: "Programado Noche",
    workday: "L-V",
    startDate: new Date("2018-12-01"),
    position: "Operario Turno Noche",
    phone: "+34 600 899 900",
    seniority: 6
  },
  {
    id: "24",
    name: "Concepción Ruiz Blanco",
    email: "concepcion.ruiz@empresa.com",
    role: "worker",
    department: "Operations",
    shift: "Programado Noche",
    workday: "Rotativo",
    startDate: new Date("2021-11-10"),
    position: "Técnica Operaciones Noche",
    phone: "+34 600 011 223",
    seniority: 3
  },
  {
    id: "25",
    name: "Andrés Cano López",
    email: "andres.cano@empresa.com",
    role: "worker",
    department: "Operations",
    shift: "Programado Noche",
    workday: "L-V",
    startDate: new Date("2019-05-14"),
    position: "Supervisor Nocturno",
    phone: "+34 600 334 556",
    seniority: 5
  },
  
  // Soporte Médico
  {
    id: "26",
    name: "David Herrera Ramos",
    email: "david.herrera@empresa.com",
    role: "worker",
    department: "Medical Support",
    shift: "Urgencias 24h",
    workday: "24h Cycle",
    startDate: new Date("2019-04-15"),
    position: "Técnico Emergencias Médicas",
    phone: "+34 600 556 778",
    seniority: 5
  },
  {
    id: "27",
    name: "Dolores Méndez Ortega",
    email: "dolores.mendez@empresa.com",
    role: "worker",
    department: "Medical Support",
    shift: "Morning",
    workday: "L-V",
    startDate: new Date("2020-09-25"),
    position: "Supervisora de Calidad Sanitaria",
    phone: "+34 600 778 990",
    seniority: 4
  },
  {
    id: "28",
    name: "Roberto Vega Serrano",
    email: "roberto.vega@empresa.com",
    role: "worker",
    department: "Medical Support",
    shift: "Urgencias 12h",
    workday: "Rotativo",
    startDate: new Date("2021-02-08"),
    position: "Auxiliar Sanitario Urgencias",
    phone: "+34 600 990 112",
    seniority: 3
  },
  
  // Telecomunicaciones
  {
    id: "29",
    name: "Javier Castillo Navarro",
    email: "javier.castillo@empresa.com",
    role: "worker",
    department: "Telecommunications",
    shift: "On-call",
    workday: "Flexible",
    startDate: new Date("2020-10-05"),
    position: "Técnico de Soporte IT",
    phone: "+34 600 112 334",
    seniority: 4
  },
  {
    id: "30",
    name: "Beatriz Romero Gil",
    email: "beatriz.romero@empresa.com",
    role: "worker",
    department: "Telecommunications",
    shift: "Localizado",
    workday: "Flexible",
    startDate: new Date("2021-02-18"),
    position: "Especialista Comunicaciones",
    phone: "+34 600 334 556",
    seniority: 3
  },
  {
    id: "31",
    name: "Diego Prieto Ramos",
    email: "diego.prieto@empresa.com",
    role: "worker",
    department: "Telecommunications",
    shift: "Morning",
    workday: "L-V",
    startDate: new Date("2020-06-12"),
    position: "Administrador de Sistemas",
    phone: "+34 600 556 778",
    seniority: 4
  },
  {
    id: "32",
    name: "Cristina Blanco Herrera",
    email: "cristina.blanco@empresa.com",
    role: "worker",
    department: "Telecommunications",
    shift: "Afternoon",
    workday: "L-V",
    startDate: new Date("2021-08-30"),
    position: "Analista de Comunicaciones",
    phone: "+34 600 778 990",
    seniority: 3
  }
];
