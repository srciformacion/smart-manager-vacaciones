
import { User } from "@/types";

export const exampleUser: User = {
  id: "1",
  name: "Ana García López",
  email: "ana.garcia@empresa.com",
  role: "hr",
  department: "Human Resources",
  shift: "Morning",
  workday: "L-V",
  employeeNumber: "EMP0001",
  hireDate: "2020-01-15",
  position: "Gerente de RRHH",
  phone: "+34 600 123 456",
  seniority: 4
};

export const predefinedWorkers: User[] = [
  {
    id: "2",
    name: "Carlos Rodríguez Martín",
    email: "carlos.rodriguez@empresa.com",
    role: "worker",
    department: "Operations",
    shift: "Morning",
    workday: "L-V",
    employeeNumber: "EMP0002",
    hireDate: "2019-03-10",
    position: "Operario de Producción",
    phone: "+34 600 234 567",
    seniority: 5
  },
  {
    id: "3",
    name: "María González Fernández",
    email: "maria.gonzalez@empresa.com",
    role: "worker",
    department: "Operations",
    shift: "Afternoon",
    workday: "L-V",
    employeeNumber: "EMP0003",
    hireDate: "2021-06-01",
    position: "Técnico de Calidad",
    phone: "+34 600 345 678",
    seniority: 3
  },
  {
    id: "4",
    name: "José Martínez Sánchez",
    email: "jose.martinez@empresa.com",
    role: "worker",
    department: "Operations",
    shift: "Night",
    workday: "Rotativo",
    employeeNumber: "EMP0004",
    hireDate: "2018-09-15",
    position: "Técnico de Mantenimiento",
    phone: "+34 600 456 789",
    seniority: 6
  },
  {
    id: "5",
    name: "Laura López Pérez",
    email: "laura.lopez@empresa.com",
    role: "worker",
    department: "Finance",
    shift: "Morning",
    workday: "L-V",
    employeeNumber: "EMP0005",
    hireDate: "2022-01-10",
    position: "Administrativa",
    phone: "+34 600 567 890",
    seniority: 2
  }
];
